namespace KindNet.Models.Interfaces
{
    public interface INotificationRepository
    {
        Task CreateNotificationAsync(Notification notification);
        Task CreateNotificationsForMultipleUsersAsync(List<long> userIds, Notification notification);
        Task<IEnumerable<Notification>> GetNotificationsForUserAsync(long userId);
        Task<bool> DeleteNotificationAsync(long notificationId, long userId);
        Task<bool> UpdateNotificationAsync(Notification notification);
        public Task<int> GetUnreadNotificationCountAsync(long userId);
        Task<Notification> GetNotificationByIdAsync(long notificationId);
    }
}
