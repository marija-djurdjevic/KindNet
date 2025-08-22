namespace KindNet.Repositories
{
    using KindNet.Data;
    using KindNet.Models;
    using KindNet.Models.Interfaces;
    using KindNet.Models.Enums;
    using Microsoft.EntityFrameworkCore;
    public class EventRepository : IEventRepository
    {
        private readonly AppDbContext _context;

        public EventRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Event> AddAsync(Event newEvent)
        {
            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();
            return newEvent;
        }

        public async Task<Event> GetByIdAsync(long id)
        {
            return await _context.Events
                .Include(e => e.Organizer) 
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            return await _context.Events
                .Include(e => e.Organizer)
                .ToListAsync();
        }

        public async Task<Event> GetOverlappingEventAsync(string city, DateTime startTime, DateTime endTime)
        {
            return await _context.Events
                .Where(e =>
                    e.City == city &&
                    (e.Status == EventStatus.Planned || e.Status == EventStatus.Active) &&
                    e.StartTime < endTime &&
                    e.EndTime > startTime)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Event>> GetAllByOrganizerIdAsync(long organizerId)
        {
            return await _context.Events
                .Where(e => e.OrganizerId == organizerId)
                .Include(e => e.Organizer)
                .ToListAsync();
        }
        public async Task<IEnumerable<Event>> GetPlannedAndActiveEventsAsync()
        {
            return await _context.Events
                .Where(e => e.Status == EventStatus.Planned || e.Status == EventStatus.Active)
                .Include(e => e.Organizer)
                .ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetPlannedAndActiveEventsWithFiltersAsync(string? city = null, EventType? type = null, string? organizationName = null)
        {
            var query = _context.Events
                .Include(e => e.Organizer)
                .Where(e => e.Status == EventStatus.Planned || e.Status == EventStatus.Active)
                .AsQueryable();

            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(e => e.City.ToLower() == city.ToLower());
            }

            if (type.HasValue)
            {
                query = query.Where(e => e.Type == type.Value);
            }

            if (!string.IsNullOrEmpty(organizationName))
            {
                query = query.Where(e => e.Organizer != null && e.Organizer.Name.ToLower().Contains(organizationName.ToLower()));
            }

            return await query.ToListAsync();
        }


    }
}
