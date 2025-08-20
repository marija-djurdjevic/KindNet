using KindNet.Data;
using KindNet.Dtos;
using KindNet.Models;
using KindNet.Models.Enums;
using Microsoft.AspNetCore.Mvc;

namespace KindNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EventController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto eventDto)
        {
            var temporaryOrganizerId = 1L;

            var newEvent = new Event
            {
                Name = eventDto.Name,
                Description = eventDto.Description,
                City = eventDto.City,
                StartTime = eventDto.StartTime,
                EndTime = eventDto.EndTime,
                Type = eventDto.Type,
                Status = EventStatus.Draft,
                OrganizerId = temporaryOrganizerId
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = newEvent.Id }, newEvent);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvent(long id)
        {
            var foundEvent = await _context.Events.FindAsync(id);

            if (foundEvent == null)
            {
                return NotFound();
            }

            return Ok(foundEvent);
        }
    }
}
