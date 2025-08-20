namespace KindNet.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    public class OrganizationProfile
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public User User { get; set; }

        public string Name { get; set; }
        public string City { get; set; }
        public string Description { get; set; }
        public string ContactPhone { get; set; }
        public string Website { get; set; }
        public bool IsVerified { get; set; }

        public List<string> GalleryImageUrls { get; set; }
        public List<string> ActivityAreas { get; set; }
    }
}
