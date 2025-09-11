using KindNet.Models.Enums;

namespace KindNet.Dtos
{
    public class CreateResourceRequestDto
    {
        public long EventId { get; set; }
        public string ItemName { get; set; }
        public ResourceCategory Category { get; set; }
        public int QuantityNeeded { get; set; }
    }
}
