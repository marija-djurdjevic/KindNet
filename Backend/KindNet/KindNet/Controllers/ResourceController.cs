using KindNet.Dtos;
using KindNet.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.Design;

namespace KindNet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResourcesController : ControllerBase
    {
        private readonly ResourceService _resourceService;

        public ResourcesController(ResourceService resourceService)
        {
            _resourceService = resourceService;
        }

       /* [HttpGet("{id}")]
        public async Task<ActionResult<ResourceDto>> GetById(long id)
        {
            var resource = await _resourceService.GetByIdAsync(id);
            if (resource == null) return NotFound();
            return Ok(resource);
        }

        [HttpGet("event/{eventId}")]
        public async Task<ActionResult<IEnumerable<ResourceDto>>> GetByEventId(long eventId)
        {
            var resources = await _resourceService.GetByEventIdAsync(eventId);
            return Ok(resources);
        }

        [HttpPost]
        public async Task<ActionResult<ResourceDto>> Create([FromBody] ResourceDto dto)
        {
            var created = await _resourceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ResourceDto>> Update(long id, [FromBody] ResourceDto dto)
        {
            if (id != dto.Id) return BadRequest("Mismatched resource id");

            var updated = await _resourceService.UpdateAsync(dto);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var deleted = await _resourceService.DeleteAsync(id);
            if (!deleted) return NotFound();

            return NoContent();
        }*/
    }
}
