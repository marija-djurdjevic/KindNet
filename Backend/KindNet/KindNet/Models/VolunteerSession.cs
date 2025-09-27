using static System.Net.Mime.MediaTypeNames;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace KindNet.Models
{
    public class VolunteerSession
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("EventApplication")]
        public long ApplicationId { get; set; } 
        public EventApplication Application { get; set; }

        public DateOnly SessionDate { get; set; } 

        public double HoursVolunteered { get; set; } 

        public bool AttendanceStatus { get; set; }
    }
}
