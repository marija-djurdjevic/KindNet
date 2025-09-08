namespace KindNet.Dtos
{
    public class OrganizationProfileDto
    {
        public string Name { get; set; }
        public string City { get; set; }
        public string Description { get; set; }
        public string ContactPhone { get; set; }
        public string Website { get; set; }
        public List<string> GalleryImageUrls { get; set; }
        public List<string> ActivityAreas { get; set; }
    }
}
