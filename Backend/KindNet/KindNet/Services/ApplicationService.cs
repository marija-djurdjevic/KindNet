using KindNet.Models.Dto;
using KindNet.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KindNet.Data;
using KindNet.Models.Interfaces;
using KindNet.Models.Enums;
using KindNet.Models;

namespace KindNet.Services
{
    public class ApplicationService 
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly AppDbContext _context;

        public ApplicationService(IApplicationRepository applicationRepository, AppDbContext context)
        {
            _applicationRepository = applicationRepository;
            _context = context;
        }

        public async Task<IEnumerable<EventApplicationDto>> GetApplicationsForOwnerEventsAsync(long userId)
        {
            var organizationProfile = await _context.OrganizationProfiles
                                                    .SingleOrDefaultAsync(o => o.UserId == userId);

            if (organizationProfile == null)
            {
                return new List<EventApplicationDto>();
            }

            var ownerEvents = await _context.Events
                                            .Where(e => e.OrganizerId == organizationProfile.Id)
                                            .ToListAsync();

            if (!ownerEvents.Any())
            {
                return new List<EventApplicationDto>();
            }

            var eventIds = ownerEvents.Select(e => e.Id).ToList();

            var applications = await _applicationRepository.GetApplicationsForEventsAsync(eventIds);

            var volunteerUserIds = applications.Select(a => a.VolunteerUserId).Distinct().ToList();
            var volunteerProfiles = await _context.VolunteerProfiles
                                                   .Where(vp => volunteerUserIds.Contains(vp.UserId))
                                                   .ToDictionaryAsync(vp => vp.UserId);

            var applicationDtos = applications.Select(ea =>
            {
                volunteerProfiles.TryGetValue(ea.VolunteerUserId, out var volunteerProfile);

                return new EventApplicationDto
                {
                    ApplicationId = ea.Id,
                    VolunteerUserId = ea.VolunteerUserId,
                    VolunteerFirstName = volunteerProfile?.FirstName,
                    VolunteerLastName = volunteerProfile?.LastName,
                    VolunteerCity = volunteerProfile?.City,
                    VolunteerContactPhone = volunteerProfile?.ContactPhone,
                    VolunteerSkills = volunteerProfile?.Skills,
                    VolunteerReliabilityScore = volunteerProfile?.ReliabilityScore ?? 0,
                    Status = ea.Status,
                    ApplicationTime = ea.ApplicationTime,
                    EventId = ea.EventId,
                    EventName = ea.Event.Name,
                    MatchingSkills = volunteerProfile?.Skills != null && ea.Event.RequiredSkills != null
                        ? volunteerProfile.Skills.Intersect(ea.Event.RequiredSkills, StringComparer.OrdinalIgnoreCase).ToList()
                        : new List<string>()
                };
            }).ToList();

            return applicationDtos;
        }

        public async Task<EventApplication> CreateApplicationAsync(long volunteerUserId, long eventId)
        {
            var eventExists = await _context.Events.AnyAsync(e => e.Id == eventId);
            if (!eventExists)
            {
                throw new ArgumentException("Događaj ne postoji.");
            }

            if (await _applicationRepository.ApplicationExistsAsync(volunteerUserId, eventId))
            {
                throw new InvalidOperationException("Već ste se prijavili na ovaj događaj.");
            }

            var user = await _context.Users.FindAsync(volunteerUserId);
            if (user == null || user.Role != UserRole.Volunteer)
            {
                throw new UnauthorizedAccessException("Samo volonteri mogu da se prijave na događaje.");
            }

            var newApplication = new EventApplication
            {
                VolunteerUserId = volunteerUserId,
                EventId = eventId,
                Status = ApplicationStatus.Pending,
                ApplicationTime = DateTime.UtcNow
            };

            await _applicationRepository.AddApplicationAsync(newApplication);

            return newApplication;
        }

        public async Task<bool> UpdateApplicationStatusAsync(long applicationId, ApplicationStatus status, long userId)
        {
            var application = await _applicationRepository.GetApplicationByIdAsync(applicationId);

            if (application == null)
            {
                throw new KeyNotFoundException("Prijava sa datim ID-jem ne postoji.");
            }

            var eventData = await _context.Events
                                          .Include(e => e.Organizer)
                                          .FirstOrDefaultAsync(e => e.Id == application.EventId);

            if (eventData == null || eventData.Organizer.UserId != userId)
            {
                throw new UnauthorizedAccessException("Nemate dozvolu da mijenjate status ove prijave.");
            }

            return await _applicationRepository.UpdateApplicationStatusAsync(applicationId, status);
        }

        public async Task<bool> ApplicationExistsForUserAsync(long volunteerUserId, long eventId)
        {
            return await _applicationRepository.ApplicationExistsAsync(volunteerUserId, eventId);
        }
    }
}