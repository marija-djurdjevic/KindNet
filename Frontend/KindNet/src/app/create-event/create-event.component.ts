import { Component, OnInit } from '@angular/core';
import { CreateEventDto, CreateEventPayload } from '../models/event.model';
import { EventService } from '../services/event.service';
import { Router } from '@angular/router';
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
    forceCreate: false
  };

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
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
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
    
    this.event.requiredSkills = this.requiredSkillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    if (this.event.applicationDeadline > this.event.startTime) {
      alert('Rok za prijavu mora biti pre datuma početka događaja.');
      return;
    }

    this.eventService.checkOverlap(this.event.city, this.event.startTime, this.event.endTime)
      .subscribe(isOverlapping => {
        if (isOverlapping) {
          if (confirm('Događaj se preklapa sa drugim događajem u istom gradu. Želite li da nastavite sa kreiranjem?')) {
            this.createEventWithForceCreate();
          } else {
            console.log('Kreiranje događaja je otkazano od strane korisnika.');
          }
        } else {
          this.createEvent();
        }
      });
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
      ForceCreate: this.event.forceCreate
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
      ForceCreate: this.event.forceCreate
    };

    this.eventService.createEvent(eventToSend)
      .subscribe(result => {
        alert('Događaj uspješno kreiran uprkos preklapanju!');
        this.router.navigate(['/layout/events']);
      });
  }
}