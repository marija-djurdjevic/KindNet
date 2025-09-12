import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResourceFulfillment } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = 'https://localhost:7200/api/resources';

  constructor(private http: HttpClient) { }

  createFulfillment(dto: ResourceFulfillment): Observable<ResourceFulfillment> {
    return this.http.post<ResourceFulfillment>(`${this.apiUrl}/fulfillments`, dto);
  }
}