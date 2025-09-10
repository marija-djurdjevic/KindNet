using KindNet.Models.Enums;

namespace KindNet.Dtos
{
    public class UpdateResourceRequestDto
    {
        public long Id { get; set; }
        public long EventId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public ResourceCategory Category { get; set; }
        public int QuantityNeeded { get; set; }
    }
}
