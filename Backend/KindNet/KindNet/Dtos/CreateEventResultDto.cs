namespace KindNet.Dtos
{
    public class CreateEventResultDto
    {
        public EventDto CreatedEvent { get; set; }
        public bool IsOverlapping { get; set; }
    }
}
