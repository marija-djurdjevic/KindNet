import { Component, Input, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { EventDto } from '../models/event.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  events: EventDto[] = [];
  isLoading: boolean = true;
  @Input() event: any;
  
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

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.getEvents();
  }

  onEdit(eventId: number) {
    this.router.navigate(['/layout/create-event', eventId]);
  }

  onCancel(eventId: number) {
    if (confirm('Da li ste sigurni da želite da otkažete ovaj događaj?')) {
      this.eventService.cancelEvent(eventId).subscribe({
        next: (response) => {
          console.log('Događaj uspješno otkazan', response);
          this.getEvents();
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
          this.getEvents();
        },
        error: (error: { error: string; }) => {
          console.error('Greška prilikom arhiviranja događaja:', error);
          alert('Greška: ' + error.error);
        }
      });
    }
  }

  getEvents() {
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
}