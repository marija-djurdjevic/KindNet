using KindNet.Data;
using KindNet.Models;
using KindNet.Models.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KindNet.Repositories
{
    public class ApplicationRepository : IApplicationRepository
    {
        private readonly AppDbContext _context;

        public ApplicationRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<EventApplication>> GetApplicationsForEventsAsync(IEnumerable<long> eventIds)
        {
            return await _context.EventApplications
                                 .Where(ea => eventIds.Contains(ea.EventId))
                                 .Include(ea => ea.VolunteerUser)
                                 .Include(ea => ea.Event)
                                 .ToListAsync();
        }
        public async Task AddApplicationAsync(EventApplication application)
        {
            await _context.EventApplications.AddAsync(application);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ApplicationExistsAsync(long volunteerUserId, long eventId)
        {
            return await _context.EventApplications.AnyAsync(ea => ea.VolunteerUserId == volunteerUserId && ea.EventId == eventId);
        }
    }
}