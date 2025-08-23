using Microsoft.AspNetCore.Mvc;
using KindNet.Models.Dto;
using KindNet.Services;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using KindNet.Dtos;
using KindNet.Models;
using Microsoft.AspNetCore.Authorization;

namespace KindNet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ApplicationsController : ControllerBase
    {
        private readonly ApplicationService _applicationService;

        public ApplicationsController(ApplicationService applicationService)
        {
            _applicationService = applicationService;
        }

        [HttpGet("for-owner")]
        public async Task<ActionResult<IEnumerable<EventApplicationDto>>> GetApplicationsForOwnerEvents()
        {
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null)
            {
                return Unauthorized("Korisnički ID claim ('id') nije pronađen u tokenu.");
            }

            if (!long.TryParse(userIdClaim.Value, out long ownerUserId))
            {
                return Unauthorized($"Nevažeći format korisničkog ID-a ('{userIdClaim.Value}') u tokenu. Očekuje se numerička vrednost.");
            }

            var applications = await _applicationService.GetApplicationsForOwnerEventsAsync(ownerUserId);

            return Ok(applications);
        }

        [HttpPost("apply")]
        public async Task<ActionResult<EventApplication>> ApplyForEvent([FromBody] CreateApplicationDto createApplicationDto)
        {
            try
            {
                var userIdClaim = User.FindFirst("id");
                if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long volunteerUserId))
                {
                    return Unauthorized("Korisnički ID claim ('id') nije pronađen ili je nevažeći u tokenu.");
                }

                var newApplication = await _applicationService.CreateApplicationAsync(volunteerUserId, createApplicationDto.EventId);

                return CreatedAtAction("GetApplicationsForOwnerEvents", new { id = newApplication.Id }, newApplication);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}