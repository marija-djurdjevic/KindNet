using Microsoft.AspNetCore.Mvc;
using KindNet.Dtos;
using KindNet.Models.Enums;
using KindNet.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace KindNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly EventService _eventService;

        public EventController(EventService eventService)
        {
            _eventService = eventService;
        }

        [HttpPost]
        public async Task<ActionResult<CreateEventResultDto>> Create([FromBody] CreateEventDto eventDto)
        {
            try
            {
                var userIdClaim = User.FindFirst("id");

                if (userIdClaim == null)
                {
                    return Unauthorized("Korisnički ID claim ('id') nije pronađen u tokenu.");
                }

                if (!long.TryParse(userIdClaim.Value, out long organizerId))
                {
                    return Unauthorized($"Nevažeći format korisničkog ID-a ('{userIdClaim.Value}') u tokenu. Očekuje se numerička vrednost.");
                }

                var result = await _eventService.CreateEventAsync(eventDto, organizerId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška prilikom kreiranja događaja: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvent(long id)
        {
            var eventDto = await _eventService.GetEventDtoByIdAsync(id);

            if (eventDto == null)
            {
                return NotFound();
            }

            return Ok(eventDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var eventDtos = await _eventService.GetAllEventDtosAsync();

            return Ok(eventDtos);
        }

        [HttpGet("check-overlap")]
        public async Task<IActionResult> CheckOverlap([FromQuery] string city, [FromQuery] DateTime startTime, [FromQuery] DateTime endTime)
        {
            if (string.IsNullOrEmpty(city) || startTime == default || endTime == default)
            {
                return BadRequest("City, StartTime, and EndTime are required parameters.");
            }

            var isOverlapping = await _eventService.IsEventOverlapping(city, startTime, endTime);

            return Ok(isOverlapping);
        }

        [HttpGet("my-events")]
        public async Task<IActionResult> GetMyEvents()
        {
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long organizerId))
            {
                return Unauthorized("Korisnički ID claim ('id') nije pronađen ili je nevažeći u tokenu.");
            }

            var eventDtos = await _eventService.GetAllEventsByOrganizerIdAsync(organizerId);
            return Ok(eventDtos);
        }

        [HttpGet("calendar")]
        public async Task<IActionResult> GetPlannedAndActiveEvents()
        {
            var eventDtos = await _eventService.GetPlannedAndActiveEventDtosAsync();
            return Ok(eventDtos);
        }

        [HttpGet("calendar/filtered")]
        public async Task<IActionResult> GetFilteredEvents([FromQuery] string? city, [FromQuery] string? type, [FromQuery] string? organizationName)
        {
            EventType? eventType = null;
            if (!string.IsNullOrEmpty(type) && Enum.TryParse<EventType>(type, out var parsedType))
            {
                eventType = parsedType;
            }

            var eventDtos = await _eventService.GetFilteredPlannedAndActiveEventsAsync(city, eventType, organizationName);
            return Ok(eventDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(long id, [FromBody] CreateEventDto eventDto)
        {
            try
            {
                var userIdClaim = User.FindFirst("id");
                if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long organizerId))
                {
                    return Unauthorized("Korisnički ID claim ('id') nije pronađen ili je nevažeći u tokenu.");
                }

                var updatedEventDto = await _eventService.UpdateEventAsync(id, eventDto, organizerId);

                if (updatedEventDto == null)
                {
                    return NotFound("Događaj nije pronađen ili nemate dozvolu za ažuriranje.");
                }

                return Ok(updatedEventDto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška prilikom ažuriranja događaja: {ex.Message}");
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelEvent(long id)
        {
            try
            {
                var userIdClaim = User.FindFirst("id");
                if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long organizerId))
                {
                    return Unauthorized("Korisnički ID claim ('id') nije pronađen ili je nevažeći u tokenu.");
                }

                var eventToCancel = await _eventService.GetEventByIdAsync(id);
                if (eventToCancel == null || eventToCancel.OrganizerId != organizerId)
                {
                    return Unauthorized("Nemate dozvolu da otkažete ovaj događaj.");
                }

                var result = await _eventService.CancelEventAsync(id);
                if (!result)
                {
                    return BadRequest("Događaj se ne može otkazati jer nije u statusu 'Planned' ili je preostalo manje od 24 sata do početka.");
                }

                return Ok(eventToCancel);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška prilikom otkazivanja događaja: {ex.Message}");
                return StatusCode(500, "Došlo je do greške prilikom otkazivanja događaja.");
            }
        }

        [Authorize]
        [HttpPut("{id}/archive")]
        public async Task<IActionResult> ArchiveEvent(long id)
        {
            try
            {
                var userIdClaim = User.FindFirst("id");
                if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long organizerId))
                {
                    return Unauthorized("Korisnički ID claim ('id') nije pronađen ili je nevažeći u tokenu.");
                }

                var eventToArchive = await _eventService.GetEventByIdAsync(id);
                if (eventToArchive == null || eventToArchive.OrganizerId != organizerId)
                {
                    return Unauthorized("Nemate dozvolu da arhivirate ovaj događaj.");
                }

                var result = await _eventService.ArchiveEventAsync(id);
                if (!result)
                {
                    return BadRequest("Događaj se ne može arhivirati jer nije u statusu 'Finished'.");
                }

                return Ok(eventToArchive);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška prilikom arhiviranja događaja: {ex.Message}");
                return StatusCode(500, "Došlo je do greške prilikom arhiviranja događaja.");
            }
        }

        [HttpGet("get-all-with-status")]
        public async Task<IActionResult> GetAllEventsWithStatus()
        {
            long? volunteerId = null;
            var userIdClaim = User.FindFirstValue("id");

            if (long.TryParse(userIdClaim, out long parsedId))
            {
                volunteerId = parsedId;
            }

            var result = await _eventService.GetAllEventsWithApplicationStatusAsync(volunteerId);

            return Ok(result);
        }

    }
}