using KindNet.Models.Enums;

namespace KindNet.Models.Interfaces
{
    public interface IApplicationRepository
    {
        Task<IEnumerable<EventApplication>> GetApplicationsForEventsAsync(IEnumerable<long> eventIds);
        Task AddApplicationAsync(EventApplication application); 
        Task<bool> ApplicationExistsAsync(long volunteerUserId, long eventId);

        Task<EventApplication> GetApplicationByIdAsync(long applicationId);
        Task<bool> UpdateApplicationStatusAsync(long applicationId, ApplicationStatus status);
        Task<IEnumerable<EventApplication>> GetApplicationsForEventAsync(long eventId);
    }
}
