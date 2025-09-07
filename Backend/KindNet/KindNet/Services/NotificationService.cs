using KindNet.Dtos;
using KindNet.Models;
using KindNet.Models.Enums;
using KindNet.Models.Interfaces;

namespace KindNet.Services
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task CreateNotificationAsync(long userId, string message, NotificationType type, long eventId)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                Type = type,
                EventId = eventId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            await _notificationRepository.CreateNotificationAsync(notification);
        }

        public async Task CreateNotificationsForMultipleUsersAsync(List<long> userIds, string message, NotificationType type, long eventId)
        {
            var notification = new Notification
            {
                Message = message,
                Type = type,
                EventId = eventId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };
            await _notificationRepository.CreateNotificationsForMultipleUsersAsync(userIds, notification);
        }

        public async Task<bool> DeleteNotificationAsync(long notificationId, long userId)
        {
            return await _notificationRepository.DeleteNotificationAsync(notificationId, userId);
        }

        public async Task<IEnumerable<NotificationDto>> GetNotificationsForUserAsync(long userId)
        {
            var notifications = await _notificationRepository.GetNotificationsForUserAsync(userId);

            return notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Message = n.Message,
                Type = n.Type,
                EventId = n.EventId,
                IsRead = n.IsRead,
                CreatedAt = n.CreatedAt
            }).ToList();
        }

        public async Task<bool> MarkAsReadAsync(long notificationId, long userId)
        {
            var notification = await _notificationRepository.GetNotificationByIdAsync(notificationId);

            if (notification == null || notification.UserId != userId)
            {
                return false;
            }

            notification.IsRead = true;
            return await _notificationRepository.UpdateNotificationAsync(notification);
        }

        public async Task<bool> MarkAllAsReadAsync(long userId)
        {
            var notifications = await _notificationRepository.GetNotificationsForUserAsync(userId);

            foreach (var notification in notifications.Where(n => !n.IsRead))
            {
                notification.IsRead = true;
                await _notificationRepository.UpdateNotificationAsync(notification);
            }

            return true;
        }

        public async Task<int> GetUnreadNotificationCountAsync(long userId)
        {
            return await _notificationRepository.GetUnreadNotificationCountAsync(userId);
        }
    }
}