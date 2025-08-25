import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // UVEZITE HttpHeaders
import { Observable } from 'rxjs';
import { EventApplication } from '../models/event-application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'https://localhost:7200/api/applications';

  constructor(private http: HttpClient) { }

  getApplicationsForOwnerEvents(): Observable<EventApplication[]> {
    return this.http.get<EventApplication[]>(`${this.apiUrl}/for-owner`);
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  acceptApplication(applicationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-status/${applicationId}`, JSON.stringify("Approved"), { headers: this.getHeaders() });
  }

  rejectApplication(applicationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-status/${applicationId}`, JSON.stringify("Rejected"), { headers: this.getHeaders() });
  }
  
  revertApplicationStatus(applicationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-status/${applicationId}`, JSON.stringify("Pending"), { headers: this.getHeaders() });
  }

  createApplication(eventId: number): Observable<any> {
    const body = { eventId: eventId };
    return this.http.post(`${this.apiUrl}/apply`, body);
  }

  checkApplicationStatus(eventId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-status/${eventId}`);
  }
}