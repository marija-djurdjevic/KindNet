using KindNet.Dtos;
using KindNet.Models;
using KindNet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KindNet.Controllers
{
    [ApiController]
    [Route("api/profiles/organization")]
    public class OrganizationProfileController : ControllerBase
    {
        private readonly OrganizationProfileService _organizationProfileService;

        public OrganizationProfileController(OrganizationProfileService organizationProfileService)
        {
            _organizationProfileService = organizationProfileService;
        }

        [HttpGet]
        public ActionResult<OrganizationProfile> GetMyProfile()
        {
            var userIdString = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdString) || !long.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var profile = _organizationProfileService.GetProfileByUserId(userId);

            if (profile == null)
            {
                return NotFound("Profile not found. Please create one.");
            }
            return Ok(profile);
        }

        [HttpPost]
        public IActionResult CreateOrUpdateMyProfile([FromBody] OrganizationProfileDto profileDto)
        {
            var userIdString = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdString) || !long.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            _organizationProfileService.CreateOrUpdateProfile(userId, profileDto);
            return NoContent();
        }
    }
}
