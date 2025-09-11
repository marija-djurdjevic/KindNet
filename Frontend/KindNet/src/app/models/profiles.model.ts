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
export interface OrganizationProfile {
  id?: number;
  name: string;
  city: string;
  description: string;
  contactPhone: string;
  website: string;
  isVerified?: boolean;
  galleryImageUrls: string[];
  activityAreas: string[];
}
export interface BusinessProfile {
  id: string;
  name: string;
  city: string;
  contactPhone: string;
  description: string;
  galleryImageUrls: string[];
  supportedEventsCount: number;
  isVerified: boolean;  
}
export interface BusinessProfileDto {
  name: string;
  city: string;
  contactPhone: string;
  description: string;
  galleryImageUrls: string[];
}