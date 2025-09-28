using KindNet.Data;
using KindNet.Dtos;
using KindNet.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace KindNet.Services
{
    public class DashboardService
    {
        private readonly AppDbContext _context;
        private const int TopCount = 5; 

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TopPerformersDto> GetTopPerformersAsync()
        {
            var topVolunteers = await _context.VolunteerProfiles
                .OrderByDescending(p => p.TotalHours)
                .Take(TopCount)
                .Select(p => new VolunteerProfileDto
                {
                    UserId = p.UserId,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    City = p.City,
                    TotalHours = p.TotalHours,
                    ReliabilityScore = p.ReliabilityScore,
                    EventParticipations = p.TotalApprovedApplications
                }).ToListAsync();

            var topBusinesses = await _context.BusinessProfiles
                .OrderByDescending(p => p.SupportedEventsCount)
                .Take(TopCount)
                .Select(p => new BusinessProfileDto
                {
                    UserId = p.UserId,
                    Name = p.Name,
                    City = p.City,
                    SupportedEventsCount = p.SupportedEventsCount
                }).ToListAsync();

            var topOrganizationsData = await _context.Events
                .Where(e => e.Status == EventStatus.Finished)
                .GroupBy(e => e.OrganizerId)
                .Select(g => new
                {
                    OrganizerId = g.Key,
                    FinishedEventsCount = g.Count()
                })
                .OrderByDescending(x => x.FinishedEventsCount)
                .Take(TopCount)
                .Join( 
                    _context.OrganizationProfiles,
                    orgStats => orgStats.OrganizerId,
                    profile => profile.UserId,
                    (orgStats, profile) => new OrganizationProfileDto
                    {
                        UserId = profile.UserId,
                        Name = profile.Name,
                        City = profile.City,
                        FinishedEventsCount = orgStats.FinishedEventsCount
                    })
                .ToListAsync();

            return new TopPerformersDto
            {
                TopVolunteers = topVolunteers,
                TopBusinesses = topBusinesses,
                TopOrganizations = topOrganizationsData
            };
        }
    }
}
