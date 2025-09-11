namespace KindNet.Models.Interfaces
{
    public interface IResourceRepository
    {
        Task<ResourceRequest> GetRequestByIdAsync(long id);
        Task<IEnumerable<ResourceRequest>> GetByEventIdAsync(long eventId);
        Task<ResourceRequest> AddAsync(ResourceRequest request);
        Task<ResourceRequest> UpdateAsync(ResourceRequest request);
        Task<bool> DeleteAsync(long id);
        Task<ResourceFulfillment> GetFulfillmentByIdAsync(long id);
        Task<IEnumerable<ResourceFulfillment>> GetByRequestIdAsync(long requestId);
        Task<ResourceFulfillment> AddAsync(ResourceFulfillment fulfillment);
    }
}
