using KindNet.Data;
using KindNet.Models;
using KindNet.Models.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KindNet.Repositories
{
    public class VolunteerProfileRepository : IVolunteerProfileRepository
    {
        private readonly AppDbContext _context;

        public VolunteerProfileRepository(AppDbContext context)
        {
            _context = context;
        }

        public VolunteerProfile GetByUserId(long userId)
        {
            return _context.VolunteerProfiles.FirstOrDefault(p => p.UserId == userId);
        }

        public VolunteerProfile GetById(long id)
        {
            return _context.VolunteerProfiles.Find(id);
        }

        public void Add(VolunteerProfile entity)
        {
            _context.VolunteerProfiles.Add(entity);
            _context.SaveChanges();
        }

        public void Update(VolunteerProfile entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Remove(VolunteerProfile entity)
        {
            _context.VolunteerProfiles.Remove(entity);
            _context.SaveChanges();
        }
    }
}
