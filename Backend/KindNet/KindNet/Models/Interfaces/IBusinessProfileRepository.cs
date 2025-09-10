namespace KindNet.Models.Interfaces
{
    public interface IBusinessProfileRepository
    {
        BusinessProfile GetByUserId(long userId);
        BusinessProfile GetById(long id);
        void Add(BusinessProfile entity);
        void Update(BusinessProfile entity);
        void Remove(BusinessProfile entity);
    }
}
