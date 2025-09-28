using KindNet.Models.Interfaces;
using KindNet.Models;
using KindNet.Data;
using Microsoft.EntityFrameworkCore;
using KindNet.Models.Enums;

namespace KindNet.Repositories
{
    public class ResourceRepository : IResourceRepository
    {
        private readonly AppDbContext _context;

        public ResourceRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ResourceRequest> AddAsync(ResourceRequest request)
        {
            _context.ResourceRequests.Add(request);
            await _context.SaveChangesAsync();
            return request;
        }

        public async Task<ResourceFulfillment> AddAsync(ResourceFulfillment fulfillment)
        {
            var request = await _context.ResourceRequests
                .FirstOrDefaultAsync(r => r.Id == fulfillment.RequestId);

            if (request == null)
                throw new InvalidOperationException($"Request with id {fulfillment.RequestId} not found.");

            _context.ResourceFulfillments.Add(fulfillment);

            request.QuantityFulfilled += fulfillment.QuantityProvided;

            if (request.QuantityFulfilled >= request.QuantityNeeded)
                request.Status = ResourceRequestStatus.Ispunjen;
            else
                request.Status = ResourceRequestStatus.Otvoren;

            await _context.SaveChangesAsync();
            return fulfillment;
        }

        public async Task<bool> DeleteAsync(long id)
        {
            var request = await _context.ResourceRequests
                .Include(r => r.Fulfillments)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null)
                return false;

            _context.ResourceFulfillments.RemoveRange(request.Fulfillments);
            _context.ResourceRequests.Remove(request);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ResourceRequest>> GetByEventIdAsync(long eventId)
        {
            return await _context.ResourceRequests
            .Where(r => r.EventId == eventId) 
            .Include(r => r.Fulfillments)   
            .ThenInclude(f => f.User)
        .ToListAsync();
        }

        public async Task<IEnumerable<ResourceFulfillment>> GetByRequestIdAsync(long requestId)
        {
            return await _context.ResourceFulfillments
                .Where(f => f.RequestId == requestId)
                .ToListAsync();

        }

        public async Task<ResourceFulfillment> GetFulfillmentByIdAsync(long id)
        {
            return await _context.ResourceFulfillments
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<ResourceRequest> GetRequestByIdAsync(long id)
        {
            return await _context.ResourceRequests
              .Where(r => r.Id == id) 
              .Include(r => r.Event)           
              .Include(r => r.Fulfillments)    
              .FirstOrDefaultAsync();
        }

        public async Task<ResourceRequest> UpdateAsync(ResourceRequest request)
        {
            var existing = await _context.ResourceRequests.FindAsync(request.Id);
            if (existing == null)
                throw new InvalidOperationException($"Request with id {request.Id} not found.");

            existing.ItemName = request.ItemName;
            existing.Category = request.Category;
            existing.QuantityNeeded = request.QuantityNeeded;
            existing.Status = request.Status;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<IEnumerable<ResourceFulfillment>> GetAllFulfillmentsForEventAsync(long eventId)
        {
            return await _context.ResourceFulfillments
                // Uključujemo ResourceRequest da bismo mogli da filtriramo po EventId
                .Include(rf => rf.Request)
                // Filtriramo sve Fulfillments čiji povezani Request pripada traženom događaju
                .Where(rf => rf.Request.EventId == eventId)
                .ToListAsync();
        }
    }
}
