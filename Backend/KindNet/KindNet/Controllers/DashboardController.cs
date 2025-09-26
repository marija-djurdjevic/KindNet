using KindNet.Dtos;
using KindNet.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KindNet.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly DashboardService _dashboardService;

        public DashboardController(DashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("top-performers")]
        [AllowAnonymous] 
        public async Task<ActionResult<TopPerformersDto>> GetTopPerformers()
        {
            var performers = await _dashboardService.GetTopPerformersAsync();
            return Ok(performers);
        }
    }
}
