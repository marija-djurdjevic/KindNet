export interface VolunteerProfile {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  contactPhone: string;
  skills: string[];
  interests: string[];
  totalHours: number;
  totalApprovedApplications: number;
  totalNoShows: number;
  reliabilityScore: number;
  badges: any[]; 
}
export interface VolunteerProfileDto {
  firstName: string;
  lastName: string;
  city: string;
  contactPhone: string | null;
  skills: string[];
  interests: string[];
}