using KindNet.Dtos;
using KindNet.Models.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace KindNet.Controllers
{
    [Authorize] 
    [ApiController]
    [Route("api/notifications")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserNotifications()
        {
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null)
            {
                return Unauthorized("Korisnički ID claim ('id') nije pronađen u tokenu.");
            }

            if (!long.TryParse(userIdClaim.Value, out long userId))
            {
                return Unauthorized($"Nevažeći format korisničkog ID-a ('{userIdClaim.Value}') u tokenu. Očekuje se numerička vrednost.");
            }

            var notifications = await _notificationService.GetNotificationsForUserAsync(userId);
            return Ok(notifications);
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkAsRead(long id)
        {
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null)
            {
                return Unauthorized("Korisnički ID claim ('id') nije +pronađen u tokenu.");
            }

            if (!long.TryParse(userIdClaim.Value, out long userId))
            {
                return Unauthorized($"Nevažeći format korisničkog ID-a ('{userIdClaim.Value}') u tokenu. Očekuje se numerička vrednost.");
            }

            var success = await _notificationService.MarkAsReadAsync(id, userId);

            if (!success)
            {
                return NotFound("Notifikacija nije pronađena ili nemate dozvolu.");
            }

            return NoContent();
        }

        [HttpPost("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null)
            {
                return Unauthorized("Korisnički ID claim ('id') nije pronađen u tokenu.");
            }

            if (!long.TryParse(userIdClaim.Value, out long userId))
            {
                return Unauthorized($"Nevažeći format korisničkog ID-a ('{userIdClaim.Value}') u tokenu. Očekuje se numerička vrednost.");
            }

            await _notificationService.MarkAllAsReadAsync(userId);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(long id)
        {
            var userIdClaim = User.FindFirst("id");
            if (userIdClaim == null || !long.TryParse(userIdClaim.Value, out long userId))
            {
                return Unauthorized("Korisnički ID nije pronađen u tokenu ili je nevažeći.");
            }

            var success = await _notificationService.DeleteNotificationAsync(id, userId);
            if (!success)
            {
                return NotFound("Notifikacija nije pronađena ili nemate dozvolu za brisanje.");
            }

            return NoContent();
        }
    }
}
