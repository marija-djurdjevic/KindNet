import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VolunteerProfile, VolunteerProfileDto, OrganizationProfile, BusinessProfile } from '../models/profiles.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://localhost:7200/api/profiles'; 
  private organizationUrl = 'https://localhost:7200/api/profiles/organization';
  private businessUrl = 'https://localhost:7200/api/profiles/business';

  constructor(private http: HttpClient) { }

  getVolunteerProfile(): Observable<VolunteerProfile> {
    return this.http.get<VolunteerProfile>(`${this.apiUrl}/volunteer`);
  }
  updateVolunteerProfile(profileDto: VolunteerProfileDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/volunteer`, profileDto);
  }

  getOrganizationProfile(): Observable<OrganizationProfile> {
    return this.http.get<OrganizationProfile>(this.organizationUrl);
  }
  createOrUpdateOrganizationProfile(profile: OrganizationProfile): Observable<any> {
    return this.http.post<any>(this.organizationUrl, profile);
  }
  getBusinessProfile(): Observable<BusinessProfile> {
  return this.http.get<BusinessProfile>(this.businessUrl);
}
  createOrUpdateBusinessProfile(profile: BusinessProfile): Observable<any> {
    return this.http.post<any>(this.businessUrl, profile);
}

}