using KindNet.Dtos;
using KindNet.Models;
using KindNet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KindNet.Controllers
{
    [ApiController]
    [Route("api/profiles/volunteer")]
    public class VolunteerProfileController : ControllerBase
    {
        private readonly VolunteerProfileService _volunteerProfileService;

        public VolunteerProfileController(VolunteerProfileService volunteerProfileService)
        {
            _volunteerProfileService = volunteerProfileService;
        }

        [HttpGet]
        [Authorize(Roles = "Volunteer")]
        public ActionResult<VolunteerProfile> GetMyProfile()
        {
            var userIdString = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdString) || !long.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var profile = _volunteerProfileService.GetProfileByUserId(userId);

            if (profile == null)
            {
                return NotFound("Profile not found. Please create one.");
            }
            return Ok(profile);
        }

        [HttpPost]
        [Authorize(Roles = "Volunteer")]
        public IActionResult CreateOrUpdateMyProfile([FromBody] VolunteerProfileDto profileDto)
        {
            var userIdString = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdString) || !long.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            _volunteerProfileService.CreateOrUpdateProfile(userId, profileDto);
            return NoContent();
        }
    }
}
