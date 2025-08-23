using KindNet.Models;
using KindNet.Models.Interfaces;
using KindNet.Models.Enums;
using KindNet.Dtos;

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

            var createdEventDto = new EventDto
            {
                Id = createdEvent.Id,
                Name = createdEvent.Name,
                Description = createdEvent.Description,
                City = createdEvent.City,
                StartTime = createdEvent.StartTime,
                EndTime = createdEvent.EndTime,
                Type = createdEvent.Type,
                Status = createdEvent.Status,
                ApplicationDeadline = eventDto.ApplicationDeadline,
                RequiredSkills = eventDto.RequiredSkills
            };

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

            var eventDto = new EventDto
            {
                Id = foundEvent.Id,
                Name = foundEvent.Name,
                Description = foundEvent.Description,
                City = foundEvent.City,
                StartTime = foundEvent.StartTime,
                EndTime = foundEvent.EndTime,
                Type = foundEvent.Type,
                ApplicationDeadline = foundEvent.ApplicationDeadline,
                RequiredSkills = foundEvent.RequiredSkills
            };
            return eventDto;
        }

        public async Task<IEnumerable<EventDto>> GetAllEventDtosAsync()
        {
            var events = await _eventRepository.GetAllAsync();
            var eventDtos = events.Select(e => new EventDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                City = e.City,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                Type = e.Type,
                ApplicationDeadline = e.ApplicationDeadline,
                RequiredSkills = e.RequiredSkills
            }).ToList();

            return eventDtos;
        }
        public async Task<IEnumerable<EventDto>> GetAllEventsByOrganizerIdAsync(long organizerId)
        {
            var events = await _eventRepository.GetAllByOrganizerIdAsync(organizerId);
            var eventDtos = events.Select(e => new EventDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                City = e.City,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                Type = e.Type,
                Status = e.Status,
                ApplicationDeadline = e.ApplicationDeadline,
                RequiredSkills = e.RequiredSkills
            }).ToList();

            return eventDtos;
        }

        public async Task<IEnumerable<EventDto>> GetPlannedAndActiveEventDtosAsync()
        {
            var events = await _eventRepository.GetPlannedAndActiveEventsAsync();
            var eventDtos = events.Select(e => new EventDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                City = e.City,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                Type = e.Type,
                Status = e.Status,
                ApplicationDeadline = e.ApplicationDeadline,
                RequiredSkills = e.RequiredSkills
            }).ToList();
            return eventDtos;
        }

        public async Task<IEnumerable<EventDto>> GetFilteredPlannedAndActiveEventsAsync(string? city = null, EventType? type = null, string? organizationName = null)
        {
            var events = await _eventRepository.GetPlannedAndActiveEventsWithFiltersAsync(city, type, organizationName);

            return events.Select(e => new EventDto
            {
                Id = e.Id,
                Name = e.Name,
                Description = e.Description,
                City = e.City,
                StartTime = e.StartTime,
                EndTime = e.EndTime,
                Type = e.Type,
                Status = e.Status,
                ApplicationDeadline = e.ApplicationDeadline,
                RequiredSkills = e.RequiredSkills,
                OrganizerName = e.Organizer?.Name
            }).ToList();
        }

    }
}