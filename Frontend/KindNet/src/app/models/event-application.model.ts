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