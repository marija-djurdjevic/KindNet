import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VolunteerProfile, VolunteerProfileDto } from '../models/profiles.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://localhost:7200/api/profiles'; 

  constructor(private http: HttpClient) { }

  getVolunteerProfile(): Observable<VolunteerProfile> {
    return this.http.get<VolunteerProfile>(`${this.apiUrl}/volunteer`);
  }
  updateVolunteerProfile(profileDto: VolunteerProfileDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/volunteer`, profileDto);
  }
}