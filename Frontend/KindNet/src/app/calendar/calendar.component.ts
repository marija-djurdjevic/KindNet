import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, LOCALE_ID } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { EventService } from '../services/event.service';
import { EventDto } from '../models/event.model';
import { isSameDay, isSameMonth } from 'date-fns';
import { MonthViewDay } from 'calendar-utils';

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
  
  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchEventsForCalendar();
    this.cdr.detectChanges(); 
  }

  fetchEventsForCalendar() {
    this.eventService.getPlannedAndActiveEvents().subscribe(
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
    if (isSameMonth(day.date, this.viewDate)) {
      if ((isSameDay(this.viewDate, day.date) && this.activeDayIsOpen) || day.events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        // ❌ uklonjeno menjanje viewDate da ne blokira dugmad za mesec
      }
      this.cdr.detectChanges();
    }
  }

  private mapToCalendarEvents(events: EventDto[]): CalendarEvent[] {
    return events.map(event => {
      const colors = {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
      };
      
      return {
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        title: `${event.name}`,
        color: colors,
        allDay: false
      };
    });
  }
}
