namespace KindNet.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using KindNet.Models.Enums;

    public class Event
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("OrganizationProfile")]
        public long OrganizerId { get; set; }
        public OrganizationProfile Organizer { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public string City { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public EventType Type { get; set; }
        public EventStatus Status { get; set; }
    }
}
