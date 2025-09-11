using KindNet.Models.Interfaces;
using KindNet.Models;
using KindNet.Dtos;
using KindNet.Models.Enums;

namespace KindNet.Services
{
    public class ResourceService 
    {
        private readonly IResourceRepository _resourceRepository;

        public ResourceService(IResourceRepository resourceRepository)
        {
            _resourceRepository = resourceRepository;
        }

        public async Task<ResourceRequestDto> CreateRequestAsync(CreateResourceRequestDto dto)
        {
            var request = new ResourceRequest
            {
                EventId = dto.EventId,
                ItemName = dto.ItemName,
                Category = dto.Category,
                QuantityNeeded = dto.QuantityNeeded,
                QuantityFulfilled = 0,
                Status = ResourceRequestStatus.Open
            };

            var saved = await _resourceRepository.AddAsync(request);
            return MapToDto(saved);
        }

        // ➤ Kreiranje fulfillmenta
        public async Task<ResourceFulfillmentDto> CreateFulfillmentAsync(CreateResourceFulfillmentDto dto)
        {
            var fulfillment = new ResourceFulfillment
            {
                RequestId = dto.RequestId,
                ProviderUserId = dto.ProviderUserId,
                QuantityProvided = dto.QuantityProvided,
                AgreementTime = DateTime.UtcNow
            };

            var saved = await _resourceRepository.AddAsync(fulfillment);
            return MapToDto(saved);
        }

        public async Task<IEnumerable<ResourceRequestDto>> GetRequestsByEventAsync(long eventId)
        {
            var requests = await _resourceRepository.GetByEventIdAsync(eventId);
            return requests.Select(MapToDto);
        }

        public async Task<IEnumerable<ResourceFulfillmentDto>> GetFulfillmentsByRequestAsync(long requestId)
        {
            var fulfillments = await _resourceRepository.GetByRequestIdAsync(requestId);
            return fulfillments.Select(MapToDto);
        }

        public async Task<ResourceRequestDto?> GetRequestByIdAsync(long id)
        {
            var request = await _resourceRepository.GetRequestByIdAsync(id);
            return request == null ? null : MapToDto(request);
        }

        public async Task<ResourceFulfillmentDto?> GetFulfillmentByIdAsync(long id)
        {
            var fulfillment = await _resourceRepository.GetFulfillmentByIdAsync(id);
            return fulfillment == null ? null : MapToDto(fulfillment);
        }

        public async Task<ResourceRequestDto?> UpdateRequestAsync(UpdateResourceRequestDto dto)
        {
            var request = new ResourceRequest
            {
                Id = dto.Id,
                EventId = dto.EventId,
                ItemName = dto.ItemName,
                Category = dto.Category,
                QuantityNeeded = dto.QuantityNeeded
            };

            var updated = await _resourceRepository.UpdateAsync(request);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteRequestAsync(long id)
        {
            return await _resourceRepository.DeleteAsync(id);
        }

        public async Task SyncEventResourcesAsync(long eventId, IEnumerable<ResourceRequest> newResources)
        {
            var existingResources = await _resourceRepository.GetByEventIdAsync(eventId);

            foreach (var resource in existingResources)
            {
                await _resourceRepository.DeleteAsync(resource.Id); 
            }

            foreach (var newResource in newResources)
            {
                newResource.EventId = eventId;
                var request = new ResourceRequest
                {
                    EventId = newResource.EventId,
                    ItemName = newResource.ItemName,
                    Category = newResource.Category,
                    QuantityNeeded = newResource.QuantityNeeded,
                    QuantityFulfilled = 0,
                    Status = ResourceRequestStatus.Open
                };
                await _resourceRepository.AddAsync(newResource); 
            }
        }


        private static ResourceRequestDto MapToDto(ResourceRequest request) =>
            new()
            {
                Id = request.Id,
                EventId = request.EventId,
                ItemName = request.ItemName,
                Category = request.Category,
                QuantityNeeded = request.QuantityNeeded,
                QuantityFulfilled = request.QuantityFulfilled,
                Status = request.Status
            };

        private static ResourceFulfillmentDto MapToDto(ResourceFulfillment fulfillment) =>
            new()
            {
                Id = fulfillment.Id,
                RequestId = fulfillment.RequestId,
                ProviderUserId = fulfillment.ProviderUserId,
                QuantityProvided = fulfillment.QuantityProvided,
                AgreementTime = fulfillment.AgreementTime
            };
    
    }
}
