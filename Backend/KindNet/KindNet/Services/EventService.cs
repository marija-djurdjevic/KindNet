using KindNet.Models;
using KindNet.Models.Interfaces;
using KindNet.Models.Enums;
using KindNet.Dtos;
using KindNet.Repositories;

namespace KindNet.Services
{
    public class EventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IApplicationRepository _applicationRepository;
        private readonly INotificationService _notificationService;
        private readonly ResourceService _resourceService;

        public EventService(IEventRepository eventRepository, IApplicationRepository applicationRepository, INotificationService notificationService, ResourceService resourceService)
        {
            _eventRepository = eventRepository;
            _applicationRepository = applicationRepository;
            _notificationService = notificationService;
            _resourceService = resourceService;
        }

        public async Task<bool> IsEventOverlapping(string city, DateTime startTime, DateTime endTime)
        {
            var overlappingEvent = await _eventRepository.GetOverlappingEventAsync(city, startTime, endTime);
            return overlappingEvent != null;
        }

        public async Task<CreateEventResultDto> CreateEventAsync(CreateEventDto eventDto, long organizerId)
        {
            if (!eventDto.ForceCreate)
            {
                var isOverlapping = await IsEventOverlapping(eventDto.City, eventDto.StartTime, eventDto.EndTime);

                if (isOverlapping)
                {
                    return new CreateEventResultDto { IsOverlapping = true };
                }
            }

            var newEvent = new Event
            {
                Name = eventDto.Name,
                Description = eventDto.Description,
                City = eventDto.City,
                StartTime = eventDto.StartTime,
                EndTime = eventDto.EndTime,
                Type = eventDto.Type,
                Status = eventDto.Status,
                OrganizerId = organizerId,
                ApplicationDeadline = eventDto.ApplicationDeadline,
                RequiredSkills = eventDto.RequiredSkills
            };

            var createdEvent = await _eventRepository.AddAsync(newEvent);

            if (eventDto.ResourceRequests.Any())
            {
                foreach (var resDto in eventDto.ResourceRequests)
                {
                    await _resourceService.CreateRequestAsync(new CreateResourceRequestDto
                    {
                        EventId = createdEvent.Id,
                        ItemName = resDto.ItemName,
                        Category = resDto.Category,
                        QuantityNeeded = resDto.QuantityNeeded
                    });
                }
            }

            var createdEventDto = await MapToEventDtoWithResourcesAsync(createdEvent);

            return new CreateEventResultDto
            {
                CreatedEvent = createdEventDto,
                IsOverlapping = false
            };
        }

        public async Task<Event> GetEventByIdAsync(long id)
        {
            return await _eventRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _eventRepository.GetAllAsync();
        }

        public async Task<EventDto> GetEventDtoByIdAsync(long id)
        {
            var eventItem = await _eventRepository.GetByIdAsync(id);
            if (eventItem == null) return null;

            await CheckAndUpdateStatusAsync(eventItem);

            return await MapToEventDtoWithResourcesAsync(eventItem);
        }

        public async Task<IEnumerable<EventDto>> GetAllEventDtosAsync()
        {
            var events = await _eventRepository.GetAllAsync();
            var eventDtos = new List<EventDto>();
            foreach (var eventItem in events)
            {
                await CheckAndUpdateStatusAsync(eventItem);
                var dto = await MapToEventDtoWithResourcesAsync(eventItem);
                eventDtos.Add(dto);
            }

            return eventDtos;

        }

        public async Task<IEnumerable<EventDto>> GetAllEventsByOrganizerIdAsync(long organizerId)
        {
            var events = await _eventRepository.GetAllByOrganizerIdAsync(organizerId);

            var eventDtos = new List<EventDto>();
            foreach (var eventItem in events)
            {
                await CheckAndUpdateStatusAsync(eventItem);
                var dto = await MapToEventDtoWithResourcesAsync(eventItem);
                eventDtos.Add(dto);
            }

            return eventDtos;
        }

        public async Task<IEnumerable<EventDto>> GetPlannedAndActiveEventDtosAsync()
        {
            var events = await _eventRepository.GetPlannedAndActiveEventsAsync();

            var eventDtos = new List<EventDto>();
            foreach (var eventItem in events)
            {
                await CheckAndUpdateStatusAsync(eventItem);
                var dto = await MapToEventDtoWithResourcesAsync(eventItem);
                eventDtos.Add(dto);
            }

            return eventDtos;
        }

        public async Task<IEnumerable<EventDto>> GetFilteredPlannedAndActiveEventsAsync(string? city = null, EventType? type = null, string? organizationName = null)
        {
            var events = await _eventRepository.GetPlannedAndActiveEventsWithFiltersAsync(city, type, organizationName);

            var eventDtos = new List<EventDto>();
            foreach (var eventItem in events)
            {
                await CheckAndUpdateStatusAsync(eventItem);
                var dto = await MapToEventDtoWithResourcesAsync(eventItem);
                dto.OrganizerName = eventItem.Organizer?.Name;
                eventDtos.Add(dto);
            }

            return eventDtos;
        }

        public async Task<EventDto> UpdateEventAsync(long id, CreateEventDto eventDto, long organizerId)
        {
            var existingEvent = await _eventRepository.GetByIdAsync(id);

            if (existingEvent == null || existingEvent.OrganizerId != organizerId)
            {
                return null;
            }

            existingEvent.Name = eventDto.Name;
            existingEvent.Description = eventDto.Description;
            existingEvent.City = eventDto.City;
            existingEvent.StartTime = eventDto.StartTime;
            existingEvent.EndTime = eventDto.EndTime;
            existingEvent.ApplicationDeadline = eventDto.ApplicationDeadline;
            existingEvent.RequiredSkills = eventDto.RequiredSkills;
            existingEvent.Type = eventDto.Type;
            existingEvent.Status = eventDto.Status;

            var resourceRequests = eventDto.ResourceRequests.Select(dto => new ResourceRequest
            {
                ItemName = dto.ItemName,
                QuantityNeeded = dto.QuantityNeeded,
                Category = dto.Category,
                EventId = id 
            }).ToList();

            await _resourceService.SyncEventResourcesAsync(existingEvent.Id, resourceRequests);

            var updatedEvent = await _eventRepository.UpdateAsync(existingEvent);

            await CheckAndUpdateStatusAsync(updatedEvent);
            return await MapToEventDtoWithResourcesAsync(updatedEvent);
        }

        public async Task<bool> CancelEventAsync(long eventId)
        {
            var eventToCancel = await _eventRepository.GetByIdAsync(eventId);

            if (eventToCancel == null)
            {
                return false; 
            }

            if (eventToCancel.Status != EventStatus.Planned)
            {
                return false; 
            }

            var timeUntilStart = eventToCancel.StartTime - DateTime.UtcNow;
            if (timeUntilStart.TotalHours < 24)
            {
                return false; 
            }

            eventToCancel.Status = EventStatus.Canceled;
            await _eventRepository.UpdateAsync(eventToCancel);

            var applications = await _applicationRepository.GetApplicationsForEventAsync(eventId);


            var userIds = applications
                .Where(app => app.Status != ApplicationStatus.Rejected)
                .Select(app => app.VolunteerUserId)
                .ToList();

            try
            {
                var message = $"Događaj '{eventToCancel.Name}' je otkazan.";

                await _notificationService.CreateNotificationsForMultipleUsersAsync(
                    userIds,
                    message,
                    NotificationType.EventCancelled,
                    eventToCancel.Id
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Greška prilikom slanja notifikacija za otkazan događaj: {ex.Message}");
            }

            var applicationsToReject = applications
              .Where(app => app.Status == ApplicationStatus.Pending)
              .ToList();

            if (applicationsToReject.Any())
            {
                foreach (var app in applicationsToReject)
                {
                    app.Status = ApplicationStatus.Rejected;
                }
                await _applicationRepository.UpdateRangeAsync(applicationsToReject);
            }

            return true; 
        }

        public async Task<bool> ArchiveEventAsync(long eventId)
        {
            var eventToArchive = await _eventRepository.GetByIdAsync(eventId);

            if (eventToArchive == null)
            {
                return false; 
            }

            if (eventToArchive.Status != EventStatus.Finished)
            {
                return false; 
            }

            eventToArchive.Status = EventStatus.Archived;
            await _eventRepository.UpdateAsync(eventToArchive);

            return true; 
        }

        public async Task<EventsWithApplicationStatusDto> GetAllEventsWithApplicationStatusAsync(long? volunteerId)
        {
            var allEvents = await _eventRepository.GetAllAsync();

            foreach (var eventItem in allEvents)
            {
                await CheckAndUpdateStatusAsync(eventItem);
            }

            var eventDtos = new List<EventDto>();

            foreach (var eventItem in allEvents)
            {
                var dto = await MapToEventDtoWithResourcesAsync(eventItem);
                eventDtos.Add(dto);
            }

            var applicationStatus = new Dictionary<long, bool>();

            if (volunteerId.HasValue)
            {
                foreach (var eventDto in eventDtos)
                {
                    bool isApplied = await _applicationRepository.ApplicationExistsAsync(volunteerId.Value, eventDto.Id);
                    applicationStatus[eventDto.Id] = isApplied;
                }
            }
            else
            {
                foreach (var eventDto in eventDtos)
                {
                    applicationStatus[eventDto.Id] = false;
                }
            }

            return new EventsWithApplicationStatusDto
            {
                Events = eventDtos,
                ApplicationStatus = applicationStatus
            };
        }

        private async Task CheckAndUpdateStatusAsync(Event eventItem)
        {
            if (eventItem.Status == EventStatus.Canceled || eventItem.Status == EventStatus.Archived)
                return;

            var now = DateTime.UtcNow;
            EventStatus? newStatus = null;

            if (eventItem.Status == EventStatus.Planned)
            {
                if (now >= eventItem.StartTime && now <= eventItem.EndTime)
                    newStatus = EventStatus.Active;
                else if (now > eventItem.EndTime)
                    newStatus = EventStatus.Finished;
            }
            else if (eventItem.Status == EventStatus.Active && now > eventItem.EndTime)
            {
                newStatus = EventStatus.Finished;
            }

            if (newStatus.HasValue && newStatus.Value != eventItem.Status)
            {
                eventItem.Status = newStatus.Value;
                await _eventRepository.UpdateAsync(eventItem); 
            }
        }

        private async Task<EventDto> MapToEventDtoWithResourcesAsync(Event eventItem)
        {
            var resourceRequests = await _resourceService.GetRequestsByEventAsync(eventItem.Id);

            return new EventDto
            {
                Id = eventItem.Id,
                Name = eventItem.Name,
                Description = eventItem.Description,
                City = eventItem.City,
                StartTime = eventItem.StartTime,
                EndTime = eventItem.EndTime,
                Type = eventItem.Type,
                Status = eventItem.Status,
                ApplicationDeadline = eventItem.ApplicationDeadline,
                RequiredSkills = eventItem.RequiredSkills,
                OrganizerName = eventItem.Organizer?.Name,
                OrganizerId = eventItem.OrganizerId,
                ResourceRequests = resourceRequests.ToList()
            };
        }

        public async Task<IEnumerable<EventDto>> GetOrganizerEventsWithFiltersAndSortingAsync(long organizerId, EventStatus? status = null, bool sortByStartTimeDescending = true)
        {
            var events = await _eventRepository.GetOrganizerEventsWithFiltersAndSortingAsync(
                organizerId,
                status,
                sortByStartTimeDescending
            );

            var eventDtos = new List<EventDto>();
            foreach (var eventItem in events)
            {
                await CheckAndUpdateStatusAsync(eventItem);
                var dto = await MapToEventDtoWithResourcesAsync(eventItem);
                eventDtos.Add(dto);
            }

            return eventDtos;
        }


    }
}