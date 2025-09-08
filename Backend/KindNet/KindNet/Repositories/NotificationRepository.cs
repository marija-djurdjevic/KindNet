using KindNet.Data;
using KindNet.Models;
using KindNet.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KindNet.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
        }

        public async Task CreateNotificationsForMultipleUsersAsync(List<long> userIds, Notification notification)
        {
            var notifications = userIds.Select(userId => new Notification
            {
                UserId = userId,
                Message = notification.Message,
                Type = notification.Type,
                EventId = notification.EventId,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            }).ToList();

            await _context.Notifications.AddRangeAsync(notifications);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteNotificationAsync(long notificationId, long userId)
        {
            var notification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);

            if (notification == null)
            {
                return false;
            }

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetUnreadNotificationCountAsync(long userId)
        {
            return await _context.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        public async Task<IEnumerable<Notification>> GetNotificationsForUserAsync(long userId)
        {
            return await _context.Notifications
                            .Where(n => n.UserId == userId)
                            .OrderByDescending(n => n.CreatedAt)
                            .ToListAsync();
        }

        public async Task<bool> UpdateNotificationAsync(Notification notification)
        {
            var existingNotification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == notification.Id);

            if (existingNotification == null)
            {
                return false;
            }

            _context.Entry(existingNotification).CurrentValues.SetValues(notification);
            await _context.SaveChangesAsync();
            return true;
        }

        public Task<Notification> GetNotificationByIdAsync(long notificationId)
        {
            return _context.Notifications.FirstOrDefaultAsync(n => n.Id == notificationId);
        }
    }
}