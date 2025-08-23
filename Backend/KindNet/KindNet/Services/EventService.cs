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

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
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

            var createdEventDto = MapToEventDto(createdEvent);

            return new CreateEventResultDto { CreatedEvent = createdEventDto, IsOverlapping = false };
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
            var foundEvent = await _eventRepository.GetByIdAsync(id);
            if (foundEvent == null) return null;

            CheckAndUpdateStatus(foundEvent);
            var eventDto = MapToEventDto(foundEvent);
            return eventDto;
        }

        public async Task<IEnumerable<EventDto>> GetAllEventDtosAsync()
        {
            var events = await _eventRepository.GetAllAsync();
            var eventDtos = events.Select(e =>
            {
                CheckAndUpdateStatus(e); 
                return MapToEventDto(e);
            }).ToList();

            return eventDtos;
        }
        public async Task<IEnumerable<EventDto>> GetAllEventsByOrganizerIdAsync(long organizerId)
        {
            var events = await _eventRepository.GetAllByOrganizerIdAsync(organizerId);

            var eventDtos = events.Select(e =>
            {
                CheckAndUpdateStatus(e);
                return MapToEventDto(e);
            }).ToList();

            return eventDtos;
        }

        public async Task<IEnumerable<EventDto>> GetPlannedAndActiveEventDtosAsync()
        {
            var events = await _eventRepository.GetPlannedAndActiveEventsAsync();

            var eventDtos = events.Select(e =>
            {
                CheckAndUpdateStatus(e);
                return MapToEventDto(e);
            }).ToList();

            return eventDtos;
        }

        public async Task<IEnumerable<EventDto>> GetFilteredPlannedAndActiveEventsAsync(string? city = null, EventType? type = null, string? organizationName = null)
        {
            var events = await _eventRepository.GetPlannedAndActiveEventsWithFiltersAsync(city, type, organizationName);

            var eventDtos = events.Select(e =>
            {
                CheckAndUpdateStatus(e);
                var dto = MapToEventDto(e);
                dto.OrganizerName = e.Organizer?.Name;
                return dto;
            }).ToList();

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

            var updatedEvent = await _eventRepository.UpdateAsync(existingEvent);

            var updatedEventDto = new EventDto
            {
                Id = updatedEvent.Id,
                Name = updatedEvent.Name,
                Description = updatedEvent.Description,
                City = updatedEvent.City,
                StartTime = updatedEvent.StartTime,
                EndTime = updatedEvent.EndTime,
                Type = updatedEvent.Type,
                Status = updatedEvent.Status,
                ApplicationDeadline = updatedEvent.ApplicationDeadline,
                RequiredSkills = updatedEvent.RequiredSkills,
                OrganizerName = updatedEvent.Organizer?.Name
            };

            return updatedEventDto;
        }

        private void CheckAndUpdateStatus(Event eventItem)
        {
            var now = DateTime.UtcNow;

            if (eventItem.Status == EventStatus.Planned && now >= eventItem.StartTime && now <= eventItem.EndTime)
            {
                eventItem.Status = EventStatus.Active;
                _eventRepository.UpdateAsync(eventItem);
            }
            else if (eventItem.Status == EventStatus.Active && now > eventItem.EndTime)
            {
                eventItem.Status = EventStatus.Finished;
                _eventRepository.UpdateAsync(eventItem);
            }
        }

        private EventDto MapToEventDto(Event eventItem)
        {
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
                RequiredSkills = eventItem.RequiredSkills
            };
        }


    }
}