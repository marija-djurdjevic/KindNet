namespace KindNet.Dtos
{
    public class AttendanceRecordDto
    {
        public long ApplicationId { get; set; }
        public long VolunteerUserId { get; set; }
        public string VolunteerFirstName { get; set; }
        public string VolunteerLastName { get; set; }
        public Dictionary<string, DailyAttendanceDto> DailyRecords { get; set; } = new();
    }

    public class DailyAttendanceDto
    {
        public double HoursVolunteered { get; set; }
        public bool Status { get; set; }
    }

    public class SaveAttendanceDto
    {
        public long ApplicationId { get; set; }
        public string SessionDate { get; set; } 
        public double HoursVolunteered { get; set; }
        public bool Status { get; set; }
    }
}
