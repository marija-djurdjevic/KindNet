import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateEventDto, CreateEventPayload, CreateEventResultDto, EventDto } from '../models/event.model';

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

  getMyEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(`${this.apiUrl}/my-events`);
  }
}