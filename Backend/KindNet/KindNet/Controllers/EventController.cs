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

    }
}