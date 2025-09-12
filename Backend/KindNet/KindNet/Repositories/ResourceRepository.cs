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

        //Dodavanje requesta
        public async Task<ResourceRequest> AddAsync(ResourceRequest request)
        {
            _context.ResourceRequests.Add(request);
            await _context.SaveChangesAsync();
            return request;
        }

        //Dodavanje fulfillmenta i update fulfilled količine u requestu
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

        //Brisanje requesta i njegovih fulfillmenta
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

        //Svi requestovi za određeni event
        public async Task<IEnumerable<ResourceRequest>> GetByEventIdAsync(long eventId)
        {
            return await _context.ResourceRequests
                .Include(r => r.Fulfillments)
                .Where(r => r.EventId == eventId)
                .ToListAsync();
        }

        //Svi fulfillmenti za određeni request
        public async Task<IEnumerable<ResourceFulfillment>> GetByRequestIdAsync(long requestId)
        {
            return await _context.ResourceFulfillments
                .Where(f => f.RequestId == requestId)
                .ToListAsync();
        }

        //Fulfillment po id
        public async Task<ResourceFulfillment> GetFulfillmentByIdAsync(long id)
        {
            return await _context.ResourceFulfillments
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        //Request po id
        public async Task<ResourceRequest> GetRequestByIdAsync(long id)
        {
            return await _context.ResourceRequests
                .Include(r => r.Fulfillments)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        //Update requesta (npr. ako se menja naziv ili kategorija)
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
    }
}
