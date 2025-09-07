import { Component, Input, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EventService } from '../services/event.service';
import { EventDto } from '../models/event.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { ApplicationService } from '../services/application.service';
import { ToastService } from '../services/toast.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {

  @ViewChild('confirmDialogTemplate') confirmDialogTemplate!: TemplateRef<any>;

  events: EventDto[] = [];
  isLoading: boolean = true;
  applicationStatus: { [key: number]: boolean } = {};
  now: Date = new Date();
  
  showConfirmDialog = false;
  dialogMessage = '';
  dialogAction: 'cancel' | 'archive' | 'apply' = 'cancel';
  selectedEventId: number | null = null;

  statusMapping: { [key: number]: string } = {
    0: 'Draft',
    1: 'Planned',
    2: 'Active',
    3: 'Finished',
    4: 'Canceled',
    5: 'Archived'
  };

  statusIconMapping: { [key: number]: string } = {
    0: 'edit_note',
    1: 'event_available',
    2: 'play_arrow',
    3: 'check_circle',
    4: 'cancel'
  };

  typeMapping: { [key: number]: string } = {
    0: 'Environmental',
    1: 'Cultural',
    2: 'Educational',
    3: 'Humanitarian',
    4: 'Sport',
    5: 'Community',
    6: 'Technology'
  };

  typeIconMapping: { [key: string]: string } = {
    'Environmental': 'eco',
    'Cultural': 'theater_comedy',
    'Educational': 'school',
    'Humanitarian': 'volunteer_activism',
    'Sport': 'sports_soccer',
    'Community': 'groups',
    'Technology': 'computer'
  };

  constructor(
    private eventService: EventService, 
    private router: Router, 
    private authService: AuthService, 
    private applicationService: ApplicationService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getEventsBasedOnRole();
  }

  getEventsBasedOnRole() {
    this.isLoading = true;
    let eventsObservable: Observable<any>;
    if (this.isOrganiser()) {
      eventsObservable = this.eventService.getMyEvents();
    } else {
      eventsObservable = this.eventService.getAllEventsWithApplicationStatus();
    }

    eventsObservable.subscribe({
      next: (data) => {
        if (this.isOrganiser()) {
          this.events = data;
        } else {
          this.events = data.events.filter((event: { status: string; }) => event.status !== 'Archived' && event.status !== 'Draft');
          this.applicationStatus = data.applicationStatus;
        }
        this.isLoading = false;
      }
    });
  }

  onEdit(eventId: number) {
    this.router.navigate(['/layout/create-event', eventId]);
  }

  onCancel(eventId: number) {
    this.selectedEventId = eventId;
    this.dialogAction = 'cancel';
    this.dialogMessage = 'Da li ste sigurni da želite da otkažete ovaj događaj?';
    this.showConfirmDialog = true;
  }

  onArchive(eventId: number) {
    this.selectedEventId = eventId;
    this.dialogAction = 'archive';
    this.dialogMessage = 'Da li ste sigurni da želite da arhivirate ovaj događaj?';
    this.showConfirmDialog = true;
  }

  confirmAction() {
    this.showConfirmDialog = false;
    if (this.selectedEventId) {
      if (this.dialogAction === 'cancel') {
        this.eventService.cancelEvent(this.selectedEventId).subscribe({
          next: (response) => {
            this.toastService.success('Događaj uspješno otkazan');
            this.getMyEvents();
          }
        });
      } else if (this.dialogAction === 'archive') {
        this.eventService.archiveEvent(this.selectedEventId).subscribe({
          next: (response) => {
            this.toastService.success('Događaj uspješno arhiviran');
            this.getMyEvents();
          }
        });
      } else if(this.dialogAction === 'apply') {
        this.applicationService.createApplication(this.selectedEventId).subscribe({
         next: (response) => {
          this.toastService.success('Uspješno ste se prijavili na događaj!');
          this.getEventsBasedOnRole(); 
      }
    });
      }
    }
  }

  cancelAction() {
    this.showConfirmDialog = false;
    this.selectedEventId = null;
  }

  getMyEvents() {
    this.isLoading = true;
    this.eventService.getMyEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      }
    });
  }

  viewCalendar() {
    this.router.navigate(['/calendar']);
  }

  isOrganiser() {
    return this.authService.isOrganizer();
  }

  onVolunteerApply(eventId: number) {
    this.selectedEventId = eventId;
    this.dialogAction = 'apply';
    this.dialogMessage = 'Da li ste sigurni da želite da se prijavite na ovaj događaj?';
    this.showConfirmDialog = true;
  }

  hasAppliedOnEvent(eventId: number): Observable<boolean> {
    return this.applicationService.checkApplicationStatus(eventId);
  }

  getCardClasses(event: EventDto): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {
      'event-card': true
    };
    if (this.applicationStatus[event.id]) {
      classes['applied-card'] = true;
    }
    const typeName = event.type.toLowerCase();
    classes[`type-border-${typeName}`] = true;
    return classes;
  }

  isApplicationDeadlineMet(event: EventDto): boolean {
    if (!event.applicationDeadline) {
      return false;
    }
    const deadline = new Date(event.applicationDeadline);
    return deadline.getTime() > this.now.getTime();
  }

  navigateToApplications() {
    this.router.navigate(['layout/events-applications']);
  }
}