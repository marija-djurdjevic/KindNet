using Microsoft.AspNetCore.Mvc;
using KindNet.Dtos;
using KindNet.Models.Enums;
using KindNet.Services;

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

        /*[HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto eventDto)
        {
            var result = await _eventService.CreateEventAsync(eventDto);

            if (result.IsOverlapping)
            {
                return Conflict("Događaj se preklapa sa postojećim događajem u istom gradu.");
            }

            return CreatedAtAction(nameof(GetEvent), new { id = result.CreatedEvent.Id }, result.CreatedEvent);
        }
        */

        [HttpPost]
        public async Task<ActionResult<CreateEventResultDto>> Create([FromBody] CreateEventDto eventDto)
        {
            try
            {
                var result = await _eventService.CreateEventAsync(eventDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                // OVO JE KLJUČNO ZA DEBAGOVANJE
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
    }
}