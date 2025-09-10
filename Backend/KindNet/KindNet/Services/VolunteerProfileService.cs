using KindNet.Dtos;
using KindNet.Models.Interfaces;
using KindNet.Models;

namespace KindNet.Services
{
    public class VolunteerProfileService
    {
        private readonly IVolunteerProfileRepository _volunteerProfileRepository;

        public VolunteerProfileService(IVolunteerProfileRepository volunteerProfileRepository)
        {
            _volunteerProfileRepository = volunteerProfileRepository;
        }

        public VolunteerProfile GetProfileByUserId(long userId)
        {
            return _volunteerProfileRepository.GetByUserId(userId);
        }

        public void CreateOrUpdateProfile(long userId, VolunteerProfileDto profileDto)
        {
            var existingProfile = _volunteerProfileRepository.GetByUserId(userId);

            if (existingProfile == null)
            {
                var newProfile = new VolunteerProfile
                {
                    UserId = userId,
                    FirstName = profileDto.FirstName,
                    LastName = profileDto.LastName,
                    City = profileDto.City,
                    ContactPhone = profileDto.ContactPhone,
                    Skills = profileDto.Skills,
                    Interests = profileDto.Interests
                };
                _volunteerProfileRepository.Add(newProfile);
            }
            else
            {
                existingProfile.FirstName = profileDto.FirstName;
                existingProfile.LastName = profileDto.LastName;
                existingProfile.City = profileDto.City;
                existingProfile.ContactPhone = profileDto.ContactPhone;
                existingProfile.Skills = profileDto.Skills;
                existingProfile.Interests = profileDto.Interests;

                _volunteerProfileRepository.Update(existingProfile);
            }
        }
    }
}
