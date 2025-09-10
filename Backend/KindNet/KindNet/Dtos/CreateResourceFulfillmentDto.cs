namespace KindNet.Dtos
{
    public class CreateResourceFulfillmentDto
    {
        public long RequestId { get; set; }
        public long ProviderUserId { get; set; }
        public int QuantityProvided { get; set; }
    }
}
