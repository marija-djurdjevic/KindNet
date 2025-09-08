namespace KindNet.Models.Interfaces
{
    public interface IVolunteerProfileRepository
    {
        VolunteerProfile GetByUserId(long userId);
        VolunteerProfile GetById(long id);
        void Add(VolunteerProfile entity);
        void Update(VolunteerProfile entity);
        void Remove(VolunteerProfile entity);
    }
}
