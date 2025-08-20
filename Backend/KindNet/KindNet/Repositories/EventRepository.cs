namespace KindNet.Repositories
{
    using KindNet.Data;
    using KindNet.Models;
    using KindNet.Models.Interfaces;
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
    }
}
