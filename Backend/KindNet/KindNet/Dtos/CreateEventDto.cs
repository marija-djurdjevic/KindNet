namespace KindNet.Dtos
{
    using KindNet.Models.Enums;
    using System.ComponentModel.DataAnnotations;
    public class CreateEventDto
    {
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
    }
}
