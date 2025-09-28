using KindNet.Data;
using KindNet.Models;
using KindNet.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KindNet.Repositories
{
    public class OrganizationProfileRepository : IOrganizationProfileRepository
    {
        private readonly AppDbContext _context;

        public OrganizationProfileRepository(AppDbContext context)
        {
            _context = context;
        }

        public OrganizationProfile GetByUserId(long userId)
        {
            return _context.OrganizationProfiles.FirstOrDefault(p => p.UserId == userId);
        }

        public OrganizationProfile GetById(long id)
        {
            return _context.OrganizationProfiles.Find(id);
        }

        public void Add(OrganizationProfile entity)
        {
            _context.OrganizationProfiles.Add(entity);
            _context.SaveChanges();
        }

        public void Update(OrganizationProfile entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Remove(OrganizationProfile entity)
        {
            _context.OrganizationProfiles.Remove(entity);
            _context.SaveChanges();
        }
    }
}
