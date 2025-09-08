export interface EventApplication {
  applicationId: number;
  volunteerUserId: number;
  volunteerFirstName: string;
  volunteerLastName: string;
  volunteerCity: string;
  volunteerContactPhone: string;
  volunteerSkills: string[];
  volunteerReliabilityScore: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  applicationTime: string;
  eventId: number;
  eventName: string;
  matchingSkills: string[];
}

export interface VolunteerEventApplication {
  applicationId: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  applicationTime: string;
  eventId: number;
  eventName: string;
  eventStartTime: Date;
  eventEndTime: Date;
  eventCity: string;
  matchingSkills: string[];
  organisationId: number;
  organisationName: string;
  organisationContactPhone: string;
  organisationWebsite: string;
}