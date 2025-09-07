using KindNet.Dtos;
using KindNet.Models.Enums;

namespace KindNet.Models.Interfaces
{
    public interface INotificationService
    {
        Task CreateNotificationAsync(long userId, string message, NotificationType type, long eventId);
        Task CreateNotificationsForMultipleUsersAsync(List<long> userIds, string message, NotificationType type, long eventId);
        Task<IEnumerable<NotificationDto>> GetNotificationsForUserAsync(long userId);
        Task<bool> MarkAsReadAsync(long notificationId, long userId);
        Task<bool> MarkAllAsReadAsync(long userId);
        Task<bool> DeleteNotificationAsync(long notificationId, long userId);
    }
}
