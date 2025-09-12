using KindNet.Dtos;
using KindNet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KindNet.Controllers
{
    [ApiController]
    [Route("api/resources")]
    public class ResourcesController : ControllerBase
    {
        private readonly ResourceService _resourceService;

        public ResourcesController(ResourceService resourceService)
        {
            _resourceService = resourceService;
        }

        [HttpPost("fulfillments")]
        [Authorize] 
        public async Task<IActionResult> CreateFulfillment([FromBody] CreateResourceFulfillmentDto dto)
        {
            var userIdClaim = User.FindFirst("id");

            if (userIdClaim == null)
            {
                return Unauthorized("Korisnički ID claim ('id') nije pronađen u tokenu.");
            }

            if (!long.TryParse(userIdClaim.Value, out long businessRepId))
            {
                return Unauthorized($"Nevažeći format korisničkog ID-a ('{userIdClaim.Value}') u tokenu. Očekuje se numerička vrednost.");
            }

            try
            {
                var result = await _resourceService.CreateFulfillmentAsync(dto, businessRepId);
                if (result == null)
                {
                    return BadRequest("Nije moguće procesuirati donaciju. Proverite da li zahtev postoji i da li je količina validna.");
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Došlo je do greške na serveru.");
            }
        }
    }
}
