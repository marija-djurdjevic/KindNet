namespace KindNet.Dtos
{
    public class TopPerformersDto
    {
        public List<VolunteerProfileDto> TopVolunteers { get; set; }
        public List<BusinessProfileDto> TopBusinesses { get; set; }
        public List<OrganizationProfileDto> TopOrganizations { get; set; }
    }
}
