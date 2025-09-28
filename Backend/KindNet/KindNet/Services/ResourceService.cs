using KindNet.Models.Interfaces;
using KindNet.Models;
using KindNet.Dtos;
using KindNet.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace KindNet.Services
{
    public class ResourceService 
    {
        private readonly IResourceRepository _resourceRepository;
        private readonly IBusinessProfileRepository _businessProfileRepository;
        private readonly INotificationService _notificationService;

        public ResourceService(IResourceRepository resourceRepository, IBusinessProfileRepository businessProfileRepository, INotificationService notificationService)
        {
            _resourceRepository = resourceRepository;
            _businessProfileRepository = businessProfileRepository;
            _notificationService = notificationService;
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
                Status = ResourceRequestStatus.Otvoren
            };

            var saved = await _resourceRepository.AddAsync(request);
            return MapToDto(saved);
        }

        public async Task<ResourceFulfillmentDto> CreateFulfillmentAsync(CreateResourceFulfillmentDto dto, long BusinessRepId)
        {
            var request = await _resourceRepository.GetRequestByIdAsync(dto.RequestId);
            if (request == null || request.Status == ResourceRequestStatus.Ispunjen)
            {
                return null; 
            }

            var neededQuantity = request.QuantityNeeded - request.QuantityFulfilled;
            if (dto.QuantityProvided <= 0 || dto.QuantityProvided > neededQuantity)
            {
                return null; 
            }

            var fulfillment = new ResourceFulfillment
            {
                RequestId = dto.RequestId,
                ProviderId = BusinessRepId,
                QuantityProvided = dto.QuantityProvided,
                AgreementTime = DateTime.UtcNow,
            };

            var allFulfillmentsForEvent = await _resourceRepository.GetAllFulfillmentsForEventAsync(request.EventId);
            var businessDonationsCount = allFulfillmentsForEvent
                .Count(f => f.ProviderId == BusinessRepId);

            var profile = await _businessProfileRepository.GetByUserIdAsync(BusinessRepId);
            if (businessDonationsCount < 1)
            {
                if (profile != null)
                {
                    profile.SupportedEventsCount++;
                    _businessProfileRepository.Update(profile);
                }
            }

            try
            {
                var message = "";
                if (profile == null)
                {
                    message = $"Pristigla je donacija za resurs '{request.ItemName}' za vaš događaj '{request.Event.Name}'. ";
                }
                else
                {
                    message = $"'{profile.Name}' je donirao/la resurs '{request.ItemName}' za vaš događaj '{request.Event.Name}'";
                }

                await _notificationService.CreateNotificationAsync(
                    request.Event.OrganizerId,
                    message,
                    NotificationType.Donation,
                    request.EventId
                );

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška prilikom kreiranja notifikacije: {ex.Message}");
            }

            var saved = await _resourceRepository.AddAsync(fulfillment);
            return MapToDto(saved);
        }

        public async Task<IEnumerable<ResourceRequestDto>> GetRequestsByEventAsync(long eventId)
        {
            var requests = await _resourceRepository.GetByEventIdAsync(eventId);
            var providerUserIds = requests
              .SelectMany(r => r.Fulfillments)
              .Select(f => f.User.Id)
              .Distinct()
              .ToList();

            var businessProfiles = await _businessProfileRepository.GetProfilesByUserIdsAsync(providerUserIds);
            return requests.Select(req => MapToDtoDetail(req, businessProfiles)).ToList();
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
                    Status = ResourceRequestStatus.Otvoren
                };
                await _resourceRepository.AddAsync(newResource); 
            }
        }


        public static ResourceRequestDto MapToDtoDetail(ResourceRequest request, Dictionary<long, BusinessProfile> profiles)
        {
            return new()
            {
                Id = request.Id,
                EventId = request.EventId,
                ItemName = request.ItemName,
                Category = request.Category,
                QuantityNeeded = request.QuantityNeeded,
                QuantityFulfilled = request.QuantityFulfilled,
                Status = request.Status,
                Fulfillments = request.Fulfillments?
                                    .Select(ful => MapToDtoDetail(ful, profiles))
                                    .ToList() ?? new List<ResourceFulfillmentDto>()
            };
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
                  Status = request.Status,
                  Fulfillments = request.Fulfillments?
                      .Select(MapToDto)
                      .ToList() ?? new List<ResourceFulfillmentDto>()
              };


        private static ResourceFulfillmentDto MapToDto(ResourceFulfillment fulfillment) =>
            new()
            {
                RequestId = fulfillment.RequestId,
                QuantityProvided = fulfillment.QuantityProvided,
                Id = fulfillment.Id,
                AgreementTime = fulfillment.AgreementTime,
                ProviderUserId = fulfillment.ProviderId
            };

        private static ResourceFulfillmentDto MapToDtoDetail(ResourceFulfillment fulfillment, Dictionary<long, BusinessProfile>? profiles)
        {
            profiles.TryGetValue(fulfillment.ProviderId, out var profile);

            return new()
            {
                RequestId = fulfillment.RequestId,
                QuantityProvided = fulfillment.QuantityProvided,
                Id = fulfillment.Id,
                AgreementTime = fulfillment.AgreementTime,
                ProviderUserId = fulfillment.ProviderId,
                ProviderName = profile?.Name ?? "Nepoznat donator"
            };
        }

    }
}
