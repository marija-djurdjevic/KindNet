using KindNet.Models.Enums;

namespace KindNet.Dtos
{
    public class ResourceRequestDto
    {
        public long Id { get; set; }
        public long EventId { get; set; }
        public string ItemName { get; set; }
        public ResourceCategory Category { get; set; }
        public int QuantityNeeded { get; set; }
        public int QuantityFulfilled { get; set; }
        public ResourceRequestStatus Status { get; set; }
        public List<ResourceFulfillmentDto> Fulfillments { get; set; } = new();
    }
}
