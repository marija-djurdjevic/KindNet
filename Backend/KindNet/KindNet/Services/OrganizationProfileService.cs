using KindNet.Dtos;
using KindNet.Models.Interfaces;
using KindNet.Models;

namespace KindNet.Services
{
    public class OrganizationProfileService
    {
        private readonly IOrganizationProfileRepository _organizationProfileRepository;

        public OrganizationProfileService(IOrganizationProfileRepository organizationProfileRepository)
        {
            _organizationProfileRepository = organizationProfileRepository;
        }

        public OrganizationProfile GetProfileByUserId(long userId)
        {
            return _organizationProfileRepository.GetByUserId(userId);
        }

        public void CreateOrUpdateProfile(long userId, OrganizationProfileDto profileDto)
        {
            var existingProfile = _organizationProfileRepository.GetByUserId(userId);

            if (existingProfile == null)
            {
                var newProfile = new OrganizationProfile
                {
                    UserId = userId,
                    Name = profileDto.Name,
                    City = profileDto.City,
                    Description = profileDto.Description,
                    ContactPhone = profileDto.ContactPhone,
                    Website = profileDto.Website,
                    GalleryImageUrls = profileDto.GalleryImageUrls,
                    ActivityAreas = profileDto.ActivityAreas,
                    IsVerified = false
                };
                _organizationProfileRepository.Add(newProfile);
            }
            else
            {
                existingProfile.Name = profileDto.Name;
                existingProfile.City = profileDto.City;
                existingProfile.Description = profileDto.Description;
                existingProfile.ContactPhone = profileDto.ContactPhone;
                existingProfile.Website = profileDto.Website;
                existingProfile.GalleryImageUrls = profileDto.GalleryImageUrls;
                existingProfile.ActivityAreas = profileDto.ActivityAreas;

                _organizationProfileRepository.Update(existingProfile);
            }
        }
    }
}
