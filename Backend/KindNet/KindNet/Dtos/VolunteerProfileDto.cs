namespace KindNet.Dtos
{
    public class VolunteerProfileDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string City { get; set; }
        public string ContactPhone { get; set; }
        public List<string> Skills { get; set; }
        public List<string> Interests { get; set; }
    }
}
