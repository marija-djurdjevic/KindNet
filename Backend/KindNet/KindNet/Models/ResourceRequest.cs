using KindNet.Models.Enums;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace KindNet.Models
{
    public class ResourceRequest
    {
        [Key]
        public long Id { get; set; }

        [ForeignKey("Event")]
        public long EventId { get; set; }
        public Event Event { get; set; }

        [Required]
        public string ItemName { get; set; }

        [Required]
        public ResourceCategory Category { get; set; }

        [Required]
        public int QuantityNeeded { get; set; }

        public int QuantityFulfilled { get; set; } = 0;

        public ResourceRequestStatus Status { get; set; } = ResourceRequestStatus.Otvoren;

        public List<ResourceFulfillment> Fulfillments { get; set; } = new();
    }
}
