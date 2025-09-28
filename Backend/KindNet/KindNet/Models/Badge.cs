using System.ComponentModel.DataAnnotations;

namespace KindNet.Models
{
    public class Badge
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string IconUrl { get; set; }
    }
}
