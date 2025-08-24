using KindNet.Models.Enums;
using KindNet.Models.Interfaces;

public class EventStatusUpdaterService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public EventStatusUpdaterService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var eventRepository = scope.ServiceProvider.GetRequiredService<IEventRepository>();

                var allEvents = await eventRepository.GetAllAsync();
                foreach (var eventItem in allEvents)
                {
                    var now = DateTime.UtcNow;
                    bool statusChanged = false;

                    if (eventItem.Status == EventStatus.Planned && now >= eventItem.StartTime && now <= eventItem.EndTime)
                    {
                        eventItem.Status = EventStatus.Active;
                        statusChanged = true;
                    }
                    else if (eventItem.Status == EventStatus.Active && now > eventItem.EndTime)
                    {
                        eventItem.Status = EventStatus.Finished;
                        statusChanged = true;
                    }

                    if (statusChanged)
                    {
                        await eventRepository.UpdateAsync(eventItem);
                    }
                }
            }

            await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken); 
        }
    }
}