using Microsoft.AspNetCore.Mvc;
using KindNet.Models.Dto;
using KindNet.Services;
using System.Security.Claims;
using KindNet.Dtos;
using KindNet.Models;
using KindNet.Models.Enums;

namespace KindNet.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        [HttpPost("update-status/{id}")]
        public async Task<IActionResult> UpdateApplicationStatus(long id, [FromBody] ApplicationStatus status)
        {
            try
            {
                var userIdString = User.FindFirst("id")?.Value; 
                if (string.IsNullOrEmpty(userIdString) || !long.TryParse(userIdString, out var userId))
                {
                    return Unauthorized("Korisnički ID claim ('id') nije pronađen ili je nevažeći u tokenu.");
                }

                var success = await _applicationService.UpdateApplicationStatusAsync(id, status, userId);
                if (success)
                {
                    return Ok();
                }
                return NotFound();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("check-status/{eventId}")]
        public async Task<ActionResult<bool>> CheckApplicationStatus(long eventId)
        {
            var userIdClaim = User.FindFirstValue("id");
            if (userIdClaim == null || !long.TryParse(userIdClaim, out long volunteerId))
            {
                return Unauthorized("Korisnički ID nije pronađen u tokenu ili je nevažeći.");
            }

            bool exists = await _applicationService.ApplicationExistsForUserAsync(volunteerId, eventId);

            return Ok(exists);
        }

        [HttpGet("my-applications")]
        public async Task<ActionResult<IEnumerable<VolunteerApplicationDto>>> GetApplicationsForVolunteer()
        {
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null)
            {
                return Unauthorized("Korisnički ID claim ('id') nije pronađen u tokenu.");
            }
            if (!long.TryParse(userIdClaim.Value, out long volunteerUserId))
            {
                return Unauthorized($"Nevažeći format korisničkog ID-a ('{userIdClaim.Value}') u tokenu. Očekuje se numerička vrednost.");
            }

            var volunteerApplications = await _applicationService.GetApplicationsForVolunteerAsync(volunteerUserId);

            return Ok(volunteerApplications);
        }
    }
}