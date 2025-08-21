namespace KindNet.Models.Interfaces
{
    public interface IEventRepository
    {
        Task<Event> AddAsync(Event newEvent);
        Task<Event> GetByIdAsync(long id);
        Task<IEnumerable<Event>> GetAllAsync();
        Task<Event> GetOverlappingEventAsync(string city, DateTime startTime, DateTime endTime);
        Task<IEnumerable<Event>> GetAllByOrganizerIdAsync(long organizerId);
        Task<IEnumerable<Event>> GetPlannedAndActiveEventsAsync();
    }
}
