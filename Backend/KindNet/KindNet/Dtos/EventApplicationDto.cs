namespace KindNet.Models.Dto
{
    using KindNet.Models.Enums;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class EventApplicationDto
    {
        public long ApplicationId { get; set; }
        public long VolunteerUserId { get; set; }
        public string VolunteerFirstName { get; set; }
        public string VolunteerLastName { get; set; }
        public string VolunteerCity { get; set; }
        public string VolunteerContactPhone { get; set; }
        public List<string> VolunteerSkills { get; set; }
        public double VolunteerReliabilityScore { get; set; }
        public ApplicationStatus Status { get; set; }
        public DateTime ApplicationTime { get; set; }
        public long EventId { get; set; } 
        public string EventName { get; set; }
        public List<string> MatchingSkills { get; set; } 
    }
}