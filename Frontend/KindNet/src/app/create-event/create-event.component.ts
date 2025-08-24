import { Component, OnInit } from '@angular/core';
import { CreateEventDto, CreateEventPayload } from '../models/event.model';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms'; 

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  event: CreateEventDto = {
    name: '',
    description: '',
    city: '',
    startTime: new Date(), 
    endTime: new Date(), 
    applicationDeadline: new Date(), 
    requiredSkills: [], 
    type: '',
    forceCreate: false,
    status: 'Draft'
  };

  isEditMode = false;
  eventId: number | null = null;

  startTimeDate: Date | null = null;
  startTimeTime: string = '';
  endTimeDate: Date | null = null;
  endTimeTime: string = '';
  requiredSkillsString: string = '';

  private typeMapping: { [key: string]: number } = {
    'Environmental': 0,
    'Cultural': 1,
    'Educational': 2,
    'Humanitarian': 3,
    'Sport': 4,
    'Community': 5,
    'Technology': 6,
  };

  constructor(
    private eventService: EventService,
    private router: Router,
     private route: ActivatedRoute
  ) { }

    ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.eventId = +idParam; 
        this.isEditMode = true;
        this.loadEventData(); 
      }
    });
  }

  private loadEventData() {
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe(eventData => {
        this.event = eventData;
        this.startTimeDate = new Date(eventData.startTime);
        this.startTimeTime = this.formatTime(eventData.startTime);
        this.endTimeDate = new Date(eventData.endTime);
        this.endTimeTime = this.formatTime(eventData.endTime);
        this.requiredSkillsString = eventData.requiredSkills.join(', ');
      });
    }
  }

  private formatTime(date: string): string {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onSubmit(form: NgForm, status: string) {
    if (form.invalid || !this.startTimeDate || !this.endTimeDate || !this.startTimeTime || !this.endTimeTime) {
      alert('Molimo vas popunite sva obavezna polja.');
      return;
    }
    
    const startDateTime = new Date(this.startTimeDate);
    const [startHours, startMinutes] = this.startTimeTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0); 

    const endDateTime = new Date(this.endTimeDate);
    const [endHours, endMinutes] = this.endTimeTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    if (endDateTime <= startDateTime) {
        alert('Vreme završetka mora biti nakon vremena početka.');
        return;
    }

    this.event.startTime = startDateTime;
    this.event.endTime = endDateTime;
    this.event.status = status;

    this.event.requiredSkills = this.requiredSkillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    if (this.event.applicationDeadline > this.event.startTime) {
      alert('Rok za prijavu mora biti pre datuma početka događaja.');
      return;
    }

     if (this.isEditMode && this.eventId) {
      this.updateEvent();
    } else {
      this.eventService.checkOverlap(this.event.city, this.event.startTime, this.event.endTime)
        .subscribe(isOverlapping => {
          if (isOverlapping) {
            if (confirm('Događaj se preklapa sa drugim događajem u istom gradu. Želite li da nastavite?')) {
              this.createEventWithForceCreate();
            } else {
              console.log('Kreiranje događaja je otkazano od strane korisnika.');
            }
          } else {
            this.createEvent();
          }
        });
    }
  }

  private createEvent() {
    const eventToSend: CreateEventPayload = {
      Name: this.event.name,
      Description: this.event.description,
      City: this.event.city,
      StartTime: this.event.startTime.toISOString(),
      EndTime: this.event.endTime.toISOString(),
      ApplicationDeadline: this.event.applicationDeadline.toISOString(),
      RequiredSkills: this.event.requiredSkills,
      Type: this.typeMapping[this.event.type],
      ForceCreate: this.event.forceCreate,
      Status: this.event.status 
    };

    console.log('Finalni podaci koji se šalju servisu:', eventToSend);

    this.eventService.createEvent(eventToSend)
      .subscribe(result => {
        if (result && !result.isOverlapping) {
          alert('Događaj uspješno kreiran!');
          this.router.navigate(['/layout/events']);
        }
      });
  }

   private updateEvent() {
    this.eventService.updateEvent(this.eventId!, this.event)
      .subscribe(() => {
        alert('Događaj uspješno ažuriran!');
        this.router.navigate(['/layout/events']);
      }, (error: any) => {
        alert('Došlo je do greške prilikom ažuriranja događaja.');
        console.error('Update error:', error);
      });
  }

  private createEventWithForceCreate() {
    this.event.forceCreate = true;
    
    const eventToSend: CreateEventPayload = {
      Name: this.event.name,
      Description: this.event.description,
      City: this.event.city,
      StartTime: this.event.startTime.toISOString(),
      EndTime: this.event.endTime.toISOString(),
      ApplicationDeadline: this.event.applicationDeadline.toISOString(),
      RequiredSkills: this.event.requiredSkills,
      Type: this.typeMapping[this.event.type],
      ForceCreate: this.event.forceCreate,
      Status: this.event.status
    };

    this.eventService.createEvent(eventToSend)
      .subscribe(result => {
        alert('Događaj uspješno kreiran uprkos preklapanju!');
        this.router.navigate(['/layout/events']);
      });
  }
}