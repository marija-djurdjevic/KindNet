namespace KindNet.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using KindNet.Models.Enums;
    public class EventApplication
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("User")]
        public long VolunteerUserId { get; set; }
        public User VolunteerUser { get; set; }

        [ForeignKey("Event")]
        public long EventId { get; set; }
        public Event Event { get; set; }

        public ApplicationStatus Status { get; set; }
        public DateTime ApplicationTime { get; set; }
    }
}
