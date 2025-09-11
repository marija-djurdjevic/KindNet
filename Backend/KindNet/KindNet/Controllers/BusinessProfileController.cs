using KindNet.Dtos;
using KindNet.Models;
using KindNet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KindNet.Controllers
{
    [ApiController]
    [Route("api/profiles/business")]
    public class BusinessProfileController : ControllerBase
    {
        private readonly BusinessProfileService _businessProfileService;

        public BusinessProfileController(BusinessProfileService businessProfileService)
        {
            _businessProfileService = businessProfileService;
        }

        [HttpGet]
        public ActionResult<BusinessProfile> GetMyProfile()
        {
            var userIdString = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdString) || !long.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var profile = _businessProfileService.GetProfileByUserId(userId);

            if (profile == null)
            {
                return NotFound("Profile not found. Please create one.");
            }
            return Ok(profile);
        }

        [HttpPost]
        public IActionResult CreateOrUpdateMyProfile([FromBody] BusinessProfileDto profileDto)
        {
            var userIdString = User.FindFirst("id")?.Value;
            if (string.IsNullOrEmpty(userIdString) || !long.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            _businessProfileService.CreateOrUpdateProfile(userId, profileDto);
            return NoContent();
        }
    }
}
