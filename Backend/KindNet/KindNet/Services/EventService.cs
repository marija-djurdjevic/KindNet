namespace KindNet.Services
{
    using KindNet.Models;
    using KindNet.Models.Interfaces;
    public class EventService
    {
        private readonly IEventRepository _eventRepository;

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<Event> CreateEventAsync(Event newEvent)
        {
            return await _eventRepository.AddAsync(newEvent);
        }

        public async Task<Event> GetEventByIdAsync(long id)
        {
            return await _eventRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _eventRepository.GetAllAsync();
        }
    }
}
