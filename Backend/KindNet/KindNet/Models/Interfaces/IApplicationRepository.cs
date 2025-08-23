namespace KindNet.Models.Interfaces
{
    public interface IApplicationRepository
    {
        Task<IEnumerable<EventApplication>> GetApplicationsForEventsAsync(IEnumerable<long> eventIds);
        Task AddApplicationAsync(EventApplication application); 
        Task<bool> ApplicationExistsAsync(long volunteerUserId, long eventId);
    }
}
