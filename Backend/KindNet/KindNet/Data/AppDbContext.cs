namespace KindNet.Data
{
    using KindNet.Models;
    using Microsoft.EntityFrameworkCore;
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
        public DbSet<User> Users { get; set; }
        public DbSet<OrganizationProfile> OrganizationProfiles { get; set; }
        public DbSet<VolunteerProfile> VolunteerProfiles { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventApplication> EventApplications { get; set; }
    }
}
