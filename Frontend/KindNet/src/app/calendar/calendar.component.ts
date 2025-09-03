import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, LOCALE_ID } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { EventService } from '../services/event.service';
import { EventDto } from '../models/event.model';
import { isSameDay, isSameMonth } from 'date-fns';
import { MonthViewDay } from 'calendar-utils';
import { colors } from '../utils/colors'; 

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [
    { provide: LOCALE_ID, useValue: 'sr-Latn' }
  ]
})
export class CalendarComponent implements OnInit {

  @ViewChild('cellTemplate', { static: true }) cellTemplate!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  events: CalendarEvent[] = [];

  isModalOpen: boolean = false;
  selectedEvent: CalendarEvent | null = null;

  activeFilter: 'city' | 'type' | 'organization' | null = null;
  selectedCity: string | null = null;
  selectedType: string | null = null;
  selectedOrganization: string | null = null;

  allCities: string[] = [];
  allEventTypes: string[] = [];
  allOrganizations: string[] = [];

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.populateFilterOptions(); 
    this.fetchFilteredEvents(); 
  }

  populateFilterOptions(): void {
    this.eventService.getFilteredEvents(undefined, undefined, undefined).subscribe(
      (allEvents: EventDto[]) => {
        this.allCities = Array.from(new Set(allEvents.map(e => e.city))).sort();
        this.allEventTypes = Array.from(new Set(allEvents.map(e => e.type))).sort();
        this.allOrganizations = Array.from(new Set(allEvents.map(e => e.organizerName || 'Nepoznato'))).sort();
      }
    );
  }

  toggleFilter(filter: 'city' | 'type' | 'organization'): void {
    this.activeFilter = this.activeFilter === filter ? null : filter;
  }
  
  applyFilter(filter: 'city' | 'type' | 'organization', value: string | null): void {
    if (filter === 'city') this.selectedCity = value;
    if (filter === 'type') this.selectedType = value;
    if (filter === 'organization') this.selectedOrganization = value;

    this.activeFilter = null; 
    this.fetchFilteredEvents();
  }

  fetchFilteredEvents(): void {
    const cityParam = this.selectedCity ?? undefined;
    const typeParam = this.selectedType ?? undefined;
    const orgParam = this.selectedOrganization ?? undefined;

    this.eventService.getFilteredEvents(cityParam, typeParam, orgParam).subscribe(
      (events: EventDto[]) => {
        this.events = this.mapToCalendarEvents(events);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Greška prilikom dohvaćanja događaja:', error);
      }
    );
  }

  dayClicked({ day }: { day: MonthViewDay }): void {
    
  }

  openModal(event: CalendarEvent, mouseEvent: MouseEvent): void {
  mouseEvent.stopPropagation();
  this.selectedEvent = event;
  this.isModalOpen = true;
}
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedEvent = null;
  }
  
  private mapToCalendarEvents(events: EventDto[]): CalendarEvent[] {
    const typeColors = new Map<string, any>();
    let colorIndex = 0;
  
    return events.map(event => {
      const type = event.type;
      let eventColor = typeColors.get(type);
      
      if (!eventColor) {
        eventColor = colors[colorIndex % colors.length];
        typeColors.set(type, eventColor);
        colorIndex++;
      }
  
      return {
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        title: `${event.name}`,
        color: eventColor,
        allDay: false,
        meta: {
          description: event.description,
          organizer: event.organizerName || 'Nepoznato'
        }
      };
    });
  }
}