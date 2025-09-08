namespace KindNet.Dtos
{
    public class EventsWithApplicationStatusDto
    {
        public List<EventDto> Events { get; set; }
        public Dictionary<long, bool> ApplicationStatus { get; set; }
    }
}
