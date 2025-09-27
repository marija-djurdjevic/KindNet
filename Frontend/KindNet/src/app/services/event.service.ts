import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEventDto, CreateEventPayload, CreateEventResultDto, EventDto, EventStatus } from '../models/event.model';
import { AttendanceRecord, SaveAttendanceRecord } from '../models/volunteer-attendance.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://localhost:7200/api/Event';
  constructor(private http: HttpClient) { }

  checkOverlap(city: string, startTime: Date, endTime: Date): Observable<boolean> {
    const params = new HttpParams()
      .set('city', city)
      .set('startTime', startTime.toISOString())
      .set('endTime', endTime.toISOString());

    return this.http.get<boolean>(`${this.apiUrl}/check-overlap`, { params });
  }

  createEvent(eventDto: CreateEventPayload): Observable<CreateEventResultDto> {
    return this.http.post<CreateEventResultDto>(this.apiUrl, eventDto);
  }

  getEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(this.apiUrl);
  }

  getAllEventsWithApplicationStatus(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(`${this.apiUrl}/get-all-with-status`);
  }

  getMyEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(`${this.apiUrl}/my-events`);
  }

  getPlannedAndActiveEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(`${this.apiUrl}/calendar`);
  }

 getFilteredEvents(city?: string, type?: string, organizationName?: string): Observable<EventDto[]> {
    let params = new HttpParams();
    if (city) params = params.set('city', city);
    if (type) params = params.set('type', type);
    if (organizationName) params = params.set('organizationName', organizationName);

    return this.http.get<EventDto[]>(`${this.apiUrl}/calendar/filtered`, { params });
  }

   getEventById(id: number): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}/${id}`);
  }

   updateEvent(id: number, eventData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, eventData);
  }

  cancelEvent(eventId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${eventId}/cancel`, null);
  }

  archiveEvent(eventId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${eventId}/archive`, null);
  }

  getOrganizerEventsWithFiltersAndSorting(status?: EventStatus, sortByStartTimeDescending: boolean = true): Observable<EventDto[]> {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('status', status.toString());
    }
    params = params.set('sortByStartTimeDescending', sortByStartTimeDescending.toString());
    return this.http.get<EventDto[]>(`${this.apiUrl}/my-events/filtered`, { params });
  }

   getAttendanceForEvent(eventId: number): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(`${this.apiUrl}/${eventId}/attendance`);
  }

  saveAttendance(eventId: number, records: SaveAttendanceRecord[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/attendance`, records);
  }

}