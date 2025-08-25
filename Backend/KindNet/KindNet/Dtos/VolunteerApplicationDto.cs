using KindNet.Models.Enums;

namespace KindNet.Dtos
{
    public class VolunteerApplicationDto
    {

        public long ApplicationId { get; set; }

        public ApplicationStatus Status { get; set; }

        public DateTime ApplicationTime { get; set; }

        public long EventId { get; set; }

        public string EventName { get; set; }

        public DateTime EventStartTime { get; set; }

        public DateTime EventEndTime { get; set; }

        public string EventCity { get; set; }

        public List<string> MatchingSkills { get; set; }

        public long OrganisationId { get; set; }

        public string OrganisationName { get; set; }

        public string OrganisationContactPhone { get; set; }
        public string OrganisationWebsite { get; set; }

    }
}
