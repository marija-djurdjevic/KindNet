namespace KindNet.Dtos
{
    public class ResourceFulfillmentDto
    {
        public long Id { get; set; }
        public long RequestId { get; set; }
        public long ProviderUserId { get; set; }
        public string ProviderName { get; set; }
        public int QuantityProvided { get; set; }
        public DateTime AgreementTime { get; set; }
    }
}
