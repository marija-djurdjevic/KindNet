export interface TopVolunteer {
  userId: number;
  firstName: string;
  lastName: string;
  city: string;
  totalHours: number;
  reliabilityScore: number;
  eventParticipations: number;
}

export interface TopBusiness {
  userId: number;
  name: string;
  city: string;
  supportedEventsCount: number;
}

export interface TopOrganization {
  userId: number;
  name: string;
  city: string;
  finishedEventsCount: number;
}

export interface TopPerformers {
  topVolunteers: TopVolunteer[];
  topBusinesses: TopBusiness[];
  topOrganizations: TopOrganization[];
}