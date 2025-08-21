import { Component, OnInit } from '@angular/core';
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

  statusMapping: { [key: number]: string } = {
    0: 'Draft',
    1: 'Planned',
    2: 'Active',
    3: 'Finished',
    4: 'Canceled'
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

  typeIconMapping: { [key: number]: string } = {
    0: 'eco',
    1: 'theater_comedy',
    2: 'school',
    3: 'volunteer_activism',
    4: 'sports_soccer',
    5: 'groups',
    6: 'computer'
  };

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents() {
    this.isLoading = true;
    this.eventService.getMyEvents().subscribe(
      (data) => {
        this.events = data;
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