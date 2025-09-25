using KindNet.Data;
using KindNet.Models;
using KindNet.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KindNet.Repositories
{
    public class BusinessProfileRepository : IBusinessProfileRepository
    {
        private readonly AppDbContext _context;

        public BusinessProfileRepository(AppDbContext context)
        {
            _context = context;
        }

        public BusinessProfile GetByUserId(long userId)
        {
            return _context.BusinessProfiles.FirstOrDefault(p => p.UserId == userId);
        }

        public BusinessProfile GetById(long id)
        {
            return _context.BusinessProfiles.Find(id);
        }

        public void Add(BusinessProfile entity)
        {
            _context.BusinessProfiles.Add(entity);
            _context.SaveChanges();
        }

        public void Update(BusinessProfile entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Remove(BusinessProfile entity)
        {
            _context.BusinessProfiles.Remove(entity);
            _context.SaveChanges();
        }

        public async Task<Dictionary<long, BusinessProfile>> GetProfilesByUserIdsAsync(List<long> userIds)
        {
            if (userIds == null || !userIds.Any())
            {
                return new Dictionary<long, BusinessProfile>();
            }

            return await _context.BusinessProfiles
                .Where(p => userIds.Contains(p.UserId))
                .ToDictionaryAsync(p => p.UserId);
        }
    }
}
