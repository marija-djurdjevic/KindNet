import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { EventApplication } from '../models/event-application.model';
import { groupBy } from 'rxjs/operators';
import { from, toArray } from 'rxjs';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-applications-dashboard',
  templateUrl: './applications-dashboard.component.html',
  styleUrls: ['./applications-dashboard.component.css']
})
export class ApplicationsDashboardComponent implements OnInit {
  eventApplications: EventApplication[] = [];
  eventApplicationsGroupedByEvent: { [key: number]: EventApplication[] } = {};

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.applicationService.getApplicationsForOwnerEvents().subscribe({
      next: (data) => {
        this.eventApplications = data;
        this.groupApplicationsByEvent();
      },
      error: (err) => {
        console.error('Došlo je do greške prilikom dohvatanja prijava', err);
      }
    });
  }

  groupApplicationsByEvent(): void {
    const grouped = this.eventApplications.reduce((acc, current) => {
      (acc[current.eventId] = acc[current.eventId] || []).push(current);
      return acc;
    }, {} as { [key: number]: EventApplication[] });

    this.eventApplicationsGroupedByEvent = grouped;
  }

  getPendingApplications(applications: EventApplication[]): EventApplication[] {
    return applications.filter(app => app.status === 'Pending');
  }

  getApprovedApplications(applications: EventApplication[]): EventApplication[] {
    return applications.filter(app => app.status === 'Approved');
  }
  
  getRejectedApplications(applications: EventApplication[]): EventApplication[] {
    return applications.filter(app => app.status === 'Rejected');
  }

  isMatchingSkill(skill: string, matchingSkills: string[]): boolean {
    return matchingSkills.includes(skill);
  }

  onAccept(applicationId: number): void {
    this.applicationService.acceptApplication(applicationId).subscribe({
      next: () => {
        this.fetchApplications();
      },
      error: (err) => {
        console.error('Greška prilikom prihvatanja prijave', err);
      }
    });
  }

  onReject(applicationId: number): void {
    this.applicationService.rejectApplication(applicationId).subscribe({
      next: () => {
        this.fetchApplications();
      },
      error: (err) => {
        console.error('Greška prilikom odbijanja prijave', err);
      }
    });
  }
}