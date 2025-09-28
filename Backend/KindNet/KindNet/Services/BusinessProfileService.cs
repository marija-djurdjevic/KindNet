using KindNet.Dtos;
using KindNet.Models.Interfaces;
using KindNet.Models;

namespace KindNet.Services
{
    public class BusinessProfileService
    {
        private readonly IBusinessProfileRepository _businessProfileRepository;

        public BusinessProfileService(IBusinessProfileRepository businessProfileRepository)
        {
            _businessProfileRepository = businessProfileRepository;
        }

        public BusinessProfile GetProfileByUserId(long userId)
        {
            return _businessProfileRepository.GetByUserId(userId);
        }

        public void CreateOrUpdateProfile(long userId, BusinessProfileDto profileDto)
        {
            var existingProfile = _businessProfileRepository.GetByUserId(userId);

            if (existingProfile == null)
            {
                var newProfile = new BusinessProfile
                {
                    UserId = userId,
                    Name = profileDto.Name,
                    City = profileDto.City,
                    ContactPhone = profileDto.ContactPhone,
                    IsVerified = false,
                    Description = profileDto.Description,
                    GalleryImageUrls = profileDto.GalleryImageUrls
                };
                _businessProfileRepository.Add(newProfile);
            }
            else
            {
                existingProfile.Name = profileDto.Name;
                existingProfile.City = profileDto.City;
                existingProfile.ContactPhone = profileDto.ContactPhone;
                existingProfile.Description = profileDto.Description;
                existingProfile.GalleryImageUrls = profileDto.GalleryImageUrls;

                _businessProfileRepository.Update(existingProfile);
            }
        }
    }
}
