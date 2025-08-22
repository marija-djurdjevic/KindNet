using System.ComponentModel.DataAnnotations;

namespace KindNet.Dtos
{
    using KindNet.Models.Enums;
    using System.ComponentModel.DataAnnotations;
    public class EventDto
    {
        public long Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        public EventType Type { get; set; }

        public EventStatus Status { get; set; }

        [Required]
        public DateTime ApplicationDeadline { get; set; }
        public List<string> RequiredSkills { get; set; }

        public string? OrganizerName {get; set;}
    }
}
