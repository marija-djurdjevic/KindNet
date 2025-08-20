namespace KindNet.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    public class VolunteerProfile
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public User User { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string ContactPhone { get; set; }

        public List<string> Skills { get; set; }
        public List<string> Interests { get; set; }
        public double TotalHours { get; set; }
        public int TotalApprovedApplications { get; set; }
        public int TotalNoShows { get; set; }
        public double ReliabilityScore { get; set; }
    }
}
