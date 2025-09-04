import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { EventApplication, VolunteerEventApplication } from '../models/event-application.model';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-applications-dashboard',
  templateUrl: './applications-dashboard.component.html',
  styleUrls: ['./applications-dashboard.component.css']
})
export class ApplicationsDashboardComponent implements OnInit {
  eventApplications: EventApplication[] = [];
  eventApplicationsGroupedByEvent: { [key: number]: EventApplication[] } = {};
  volunteerApplications: VolunteerEventApplication[] = [];
  isLoading: boolean = true;

  applicationStatusIconMapping: { [key: string]: string } = {
    'Pending': 'schedule',
    'Approved': 'check_circle',
    'Rejected': 'cancel'
  };

  applicationStatusTextMapping: { [key: string]: string } = {
    'Pending': 'Na čekanju',
    'Approved': 'Prihvaćena',
    'Rejected': 'Odbijena'
  };

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private toastService: ToastService 
  ) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.isLoading = true;
    if (this.isOrganiser()) {
      this.getApplicationsForOwnerEvents();
    } else {
      this.getApplicationsForVolunteer();
    }
  }

  getApplicationsForOwnerEvents(): void {
    this.applicationService.getApplicationsForOwnerEvents().subscribe({
      next: (data) => {
        this.eventApplications = data;
        this.groupApplicationsByEvent();
        this.isLoading = false;
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
        this.toastService.success('Prijava je uspješno prihvaćena.'); 
      }
    });
  }

  onReject(applicationId: number): void {
    this.applicationService.rejectApplication(applicationId).subscribe({
      next: () => {
        this.fetchApplications();
        this.toastService.success('Prijava je uspješno odbijena.'); 
      }
    });
  }

  getApplicationsForVolunteer(): void {
    this.applicationService.getApplicationsForVolunteer().subscribe({
      next: (applications) => {
        this.volunteerApplications = applications;
        this.isLoading = false;
      }
    });
  }

  isOrganiser() {
    return this.authService.isOrganizer();
  }

  getApplicationStatusClass(status: string): string {
    return status.toLowerCase();
  }
}