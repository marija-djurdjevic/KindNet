using KindNet.Data;
using KindNet.Dtos;
using KindNet.Models.Enums;
using KindNet.Models;
using Microsoft.EntityFrameworkCore;

namespace KindNet.Services
{
    public class AttendanceService
    {
        private readonly AppDbContext _context;

        public AttendanceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AttendanceRecordDto>> GetAttendanceForEventAsync(long eventId)
        {
            var acceptedApplications = await _context.EventApplications
                .Include(a => a.VolunteerUser) 
                .Where(a => a.EventId == eventId && a.Status == ApplicationStatus.Approved)
                .ToListAsync();

            if (!acceptedApplications.Any())
            {
                return new List<AttendanceRecordDto>();
            }

            var volunteerUserIds = acceptedApplications.Select(a => a.VolunteerUserId).Distinct().ToList();
            var volunteerProfiles = await _context.VolunteerProfiles
                .Where(p => volunteerUserIds.Contains(p.UserId))
                .ToDictionaryAsync(p => p.UserId); 

            var applicationIds = acceptedApplications.Select(a => a.Id).ToList();
            var existingSessions = await _context.VolunteersSessions
                .Where(s => applicationIds.Contains(s.ApplicationId))
                .ToListAsync();

            var attendanceRecords = new List<AttendanceRecordDto>();
            foreach (var app in acceptedApplications)
            {
                volunteerProfiles.TryGetValue(app.VolunteerUserId, out var profile);

                var record = new AttendanceRecordDto
                {
                    ApplicationId = app.Id,
                    VolunteerUserId = app.VolunteerUserId,
                    VolunteerFirstName = profile?.FirstName ?? "Nepoznato",
                    VolunteerLastName = profile?.LastName ?? "Ime",
                    DailyRecords = new Dictionary<string, DailyAttendanceDto>()
                };

                foreach (var session in existingSessions.Where(s => s.ApplicationId == app.Id))
                {
                    var dateKey = session.SessionDate.ToString("yyyy-MM-dd");
                    record.DailyRecords[dateKey] = new DailyAttendanceDto
                    {
                        HoursVolunteered = session.HoursVolunteered,
                        Status = session.AttendanceStatus
                    };
                }
                attendanceRecords.Add(record);
            }

            return attendanceRecords;
        }

        public async Task<bool> SaveAttendanceAsync(List<SaveAttendanceDto> records)
        {
            var volunteerIdsToUpdate = new HashSet<long>();

            foreach (var record in records)
            {
                var sessionDate = DateOnly.Parse(record.SessionDate);
                var session = await _context.VolunteersSessions
                    .FirstOrDefaultAsync(s => s.ApplicationId == record.ApplicationId && s.SessionDate == sessionDate);

                if (session == null)
                {
                    session = new VolunteerSession { ApplicationId = record.ApplicationId, SessionDate = sessionDate };
                    _context.VolunteersSessions.Add(session);
                }

                session.AttendanceStatus = record.Status;
                session.HoursVolunteered = record.Status == true ? record.HoursVolunteered : 0;

                var application = await _context.EventApplications.FindAsync(record.ApplicationId);
                if (application != null)
                {
                    volunteerIdsToUpdate.Add(application.VolunteerUserId);
                }
            }

            await _context.SaveChangesAsync();

            foreach (var volunteerId in volunteerIdsToUpdate)
            {
                await UpdateVolunteerStatsAsync(volunteerId);
            }

            return true;
        }

        private async Task UpdateVolunteerStatsAsync(long volunteerId)
        {
            var profile = await _context.VolunteerProfiles.FirstOrDefaultAsync(p => p.UserId == volunteerId);
            if (profile == null) return;

            var allApprovedApplications = await _context.EventApplications
                .Include(a => a.Event) 
                .Where(a => a.VolunteerUserId == volunteerId && a.Status == ApplicationStatus.Approved)
                .ToListAsync();

            profile.TotalApprovedApplications = allApprovedApplications.Count();

            var allSessions = await _context.VolunteersSessions
                .Include(s => s.Application)
                .Where(s => s.Application.VolunteerUserId == volunteerId)
                .ToListAsync();

            profile.TotalHours = allSessions
                .Where(s => s.AttendanceStatus == true)
                .Sum(s => s.HoursVolunteered);

            int noShowCount = 0;
            var finishedApplications = allApprovedApplications.Where(a => a.Event.Status == EventStatus.Finished).ToList();

            foreach (var app in finishedApplications)
            {
                bool attendedAtLeastOnce = allSessions
                    .Any(s => s.ApplicationId == app.Id && s.AttendanceStatus == true);

                if (!attendedAtLeastOnce)
                {
                    noShowCount++;
                }
            }
            profile.TotalNoShows = noShowCount;

            var attendedApplicationIds = allSessions
                .Where(s => s.AttendanceStatus == true)
                .Select(s => s.ApplicationId)
                .Distinct()
                .ToList();

            int attendedEventsCount = allApprovedApplications
                .Count(a => attendedApplicationIds.Contains(a.Id));

            if (profile.TotalApprovedApplications > 0)
            {
                profile.ReliabilityScore = ((double)attendedEventsCount / profile.TotalApprovedApplications) * 10.0;
            }
            else
            {
                profile.ReliabilityScore = 10.0; 
            }

            _context.VolunteerProfiles.Update(profile);
            await _context.SaveChangesAsync();
        }
    }
}
