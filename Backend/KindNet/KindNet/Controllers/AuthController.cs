using KindNet.Dtos;
using Microsoft.AspNetCore.Mvc;
using KindNet.Models.Interfaces;

namespace KindNet.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public ActionResult Register(RegisterDto request)
        {
            var result = _authService.Register(request);
            if (result.IsFailed)
            {
                return BadRequest(result.Errors.First().Message);
            }
            return Ok(new { message = "Registration successful!" });
        }

        [HttpPost("login")]
        public ActionResult Login(LoginDto request)
        {
            var result = _authService.Login(request);
            if (result.IsFailed)
            {
                return Unauthorized(result.Errors.First().Message);
            }
            return Ok(result.Value);
        }
    }
}
