namespace KindNet.Dtos
{
    public class BusinessProfileDto
    {
        public long UserId { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string ContactPhone { get; set; }
        public string Description { get; set; }
        public int SupportedEventsCount { get; set; }
        public List<string> GalleryImageUrls { get; set; }
    }
}
