namespace KindNet.Models.Interfaces
{
    public interface IOrganizationProfileRepository
    {
        OrganizationProfile GetByUserId(long userId);
        OrganizationProfile GetById(long id);
        void Add(OrganizationProfile entity);
        void Update(OrganizationProfile entity);
        void Remove(OrganizationProfile entity);
    }
}
