import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { EventDto } from '../models/event.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { ApplicationService } from '../services/application.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  events: EventDto[] = [];
  isLoading: boolean = true;
  applicationStatus: { [key: number]: boolean } = {};
  now: Date = new Date();

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

  constructor(private eventService: EventService, private router: Router, private authService: AuthService, private applicationService: ApplicationService) { }

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

  eventsObservable.subscribe(
    (data) => {
    if (this.isOrganiser()) {
    this.events = data;
    } else {
    this.events = data.events.filter((event: { status: string; }) => event.status !== 'Archived' && event.status !== 'Draft');
    this.applicationStatus = data.applicationStatus;
    }
    console.log(this.events);
    this.isLoading = false;
    },
    (error) => {
    console.error('Došlo je do greške prilikom preuzimanja događaja:', error);
    this.isLoading = false;
    }
    );
 }

  onEdit(eventId: number) {
    this.router.navigate(['/layout/create-event', eventId]);
  }

  onCancel(eventId: number) {
    if (confirm('Da li ste sigurni da želite da otkažete ovaj događaj?')) {
      this.eventService.cancelEvent(eventId).subscribe({
        next: (response) => {
          console.log('Događaj uspješno otkazan', response);
          this.getMyEvents();
        },
        error: (error: { error: string; }) => {
          console.error('Greška prilikom otkazivanja događaja:', error);
          alert('Greška: ' + error.error);
        }
      });
    }
  }

  onArchive(eventId: number) {
    if (confirm('Da li ste sigurni da želite da arhivirate ovaj događaj?')) {
      this.eventService.archiveEvent(eventId).subscribe({
        next: (response) => {
          console.log('Događaj uspješno arhiviran', response);
          this.getMyEvents();
        },
        error: (error: { error: string; }) => {
          console.error('Greška prilikom arhiviranja događaja:', error);
          alert('Greška: ' + error.error);
        }
      });
    }
  }

  getMyEvents() {
    this.isLoading = true;
    this.eventService.getMyEvents().subscribe(
      (data) => {
        this.events = data;
        console.log(this.events);
        this.isLoading = false;
      },
      (error) => {
        console.error('Došlo je do greške prilikom preuzimanja događaja:', error);
        this.isLoading = false;
      }
    );
  }

  viewCalendar() {
    this.router.navigate(['/calendar']);
  }

  isOrganiser() {
    return this.authService.isOrganizer();
  }

  onVolunteerApply(eventId: number) {
    this.applicationService.createApplication(eventId).subscribe({
      next: (response) => {
        alert('Uspješno ste se prijavili na događaj!');
        console.log('Prijavljivanje uspješno', response);
        this.getEventsBasedOnRole(); 
      },
      error: (error) => {
        console.error('Greška prilikom prijave na događaj:', error);
        alert('Greška: ' + error.error);
      }
    });
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