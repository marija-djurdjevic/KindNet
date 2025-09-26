import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VolunteerProfile, VolunteerProfileDto, OrganizationProfile, BusinessProfile } from '../models/profiles.model';
import { TopPerformers } from '../models/top-users.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://localhost:7200/api/profiles'; 
  private organizationUrl = 'https://localhost:7200/api/profiles/organization';
  private businessUrl = 'https://localhost:7200/api/profiles/business';
  private dashboardUrl = 'https://localhost:7200/api/dashboard';

  constructor(private http: HttpClient) { }

  getVolunteerProfile(): Observable<VolunteerProfile> {
    return this.http.get<VolunteerProfile>(`${this.apiUrl}/volunteer`);
  }

   getVolunteerProfileByUserId(userId: number): Observable<VolunteerProfile> {
    return this.http.get<VolunteerProfile>(`${this.apiUrl}/volunteer/user/${userId}`);
  }
  
  updateVolunteerProfile(profileDto: VolunteerProfileDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/volunteer`, profileDto);
  }

  getOrganizationProfile(): Observable<OrganizationProfile> {
    return this.http.get<OrganizationProfile>(this.organizationUrl);
  }

  getOrganizationProfileByUserId(userId: number): Observable<OrganizationProfile> {
    return this.http.get<OrganizationProfile>(`${this.organizationUrl}/user/${userId}`);
  }

  createOrUpdateOrganizationProfile(profile: OrganizationProfile): Observable<any> {
    return this.http.post<any>(this.organizationUrl, profile);
  }
  getBusinessProfile(): Observable<BusinessProfile> {
    return this.http.get<BusinessProfile>(this.businessUrl);
  }

  getBusinessProfileByUserId(userId: number): Observable<BusinessProfile> {
    return this.http.get<BusinessProfile>(`${this.businessUrl}/user/${userId}`);
  }

  createOrUpdateBusinessProfile(profile: BusinessProfile): Observable<any> {
    return this.http.post<any>(this.businessUrl, profile);
  }

    getTopPerformers(): Observable<TopPerformers> {
    return this.http.get<TopPerformers>(`${this.dashboardUrl}/top-performers`);
  }

}