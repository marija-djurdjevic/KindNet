using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace KindNet.Models
{
    public class ResourceFulfillment
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("ResourceRequest")]
        public long RequestId { get; set; }
        public ResourceRequest Request { get; set; }

        [ForeignKey("User")]
        public long ProviderId { get; set; }
        public User User { get; set; }

        [Required]
        public int QuantityProvided { get; set; }

        public DateTime AgreementTime { get; set; } = DateTime.UtcNow;
    }
}
