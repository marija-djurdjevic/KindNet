import { Component, OnInit, ViewChild, TemplateRef, LOCALE_ID } from '@angular/core';
import { CreateEventDto, CreateEventPayload } from '../models/event.model';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms'; 
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../services/toast.service'; 
import { ResourceCategory, ResourceRequest } from '../models/resource.model';
import { CreateResourceDialogComponent } from '../create-resource-dialog/create-resource-dialog.component';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  providers: [
    { provide: LOCALE_ID, useValue: 'sr-Latn' }
  ]
})
export class CreateEventComponent implements OnInit {

  @ViewChild('markdownHelpTemplate') markdownHelpTemplate!: TemplateRef<any>;

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
    status: 'Draft',
    resourceRequests: []
  };

  isEditMode = false;
  eventId: number | null = null;
  showModal = false;
  modalMessage = '';
  modalAction: 'none' | 'overlap' | 'save' = 'none';

  startTimeDate: Date | null = null;
  startTimeTime: string = '';
  endTimeDate: Date | null = null;
  endTimeTime: string = '';

  selectedSkills: string[] = [];
  otherSkills: string = '';
  suggestedSkills: string[] = [];
  resourceRequests: ResourceRequest[] = [];
  
  private skillSuggestions: { [key: string]: string[] } = {
    'Environmental': ['Reciklaža', 'Upravljanje otpadom', 'Biologija', 'Ekologija', 'Održivi razvoj', 'Čišćenje', 'Edukacija o klimatskim promjenama'],
    'Cultural': ['Umjetnost', 'Istorija', 'Muzika', 'Organizacija događaja', 'Fotografija', 'Kustos', 'Likovna umjetnost', 'Prezentacija'],
    'Educational': ['Podučavanje', 'Mentorstvo', 'Informatika', 'Prezentacione vještine', 'Javna nastava', 'Istraživanje', 'Izrada plana učenja', 'Analiza podataka'],
    'Humanitarian': ['Prva pomoć', 'Komunikacija', 'Logistika', 'Empatija', 'Timski rad', 'Organizacione vještine', 'Pomoć u izbjegličkim kampovima', 'Psihološka podrška'],
    'Sport': ['Trener', 'Fizička kondicija', 'Sportska medicina', 'Timski rad', 'Organizacija turnira', 'Sudija', 'Sportski marketing', 'Nutricionizam'],
    'Community': ['Organizacija', 'Komunikacija', 'Liderstvo', 'Volonterski rad', 'Prikupljanje sredstava', 'Planiranje događaja', 'Odnosi s javnošću'],
    'Technology': ['Programiranje', 'Dizajn', 'Mrežna administracija', 'Analiza podataka', 'Razvoj mobilnih aplikacija', 'Cyber sigurnost', 'UX/UI dizajn', 'Cloud computing'],
  };

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
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastService: ToastService 
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
        console.log(eventData);
        this.startTimeDate = new Date(eventData.startTime);
        this.startTimeTime = this.formatTime(eventData.startTime);
        this.endTimeDate = new Date(eventData.endTime);
        this.endTimeTime = this.formatTime(eventData.endTime);
        this.selectedSkills = eventData.requiredSkills.filter((skill: string) => this.getSuggestedSkills(this.event.type).includes(skill));
        this.otherSkills = eventData.requiredSkills.filter((skill: string) => !this.getSuggestedSkills(this.event.type).includes(skill)).join(', ');
        this.onTypeChange();
      });
    }
  }

  private formatTime(date: string): string {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  onTypeChange() {
    this.suggestedSkills = this.skillSuggestions[this.event.type] || [];
  }

  onSkillSelect(skill: string, event: any) {
    if (event.checked) {
      this.selectedSkills.push(skill);
    } else {
      const index = this.selectedSkills.indexOf(skill);
      if (index > -1) {
        this.selectedSkills.splice(index, 1);
      }
    }
  }

  onSubmit(form: NgForm, status: string) {
    if (form.invalid || !this.startTimeDate || !this.endTimeDate || !this.startTimeTime || !this.endTimeTime) {
      this.showModalMessage('Molimo vas popunite sva obavezna polja.');
      return;
    }
    
    const startDateTime = new Date(this.startTimeDate);
    const [startHours, startMinutes] = this.startTimeTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0); 

    const endDateTime = new Date(this.endTimeDate);
    const [endHours, endMinutes] = this.endTimeTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    if (endDateTime <= startDateTime) {
      this.showModalMessage('Vrijeme završetka mora biti nakon vremena početka.');
      return;
    }

    const applicationDeadlineDate = new Date(this.event.applicationDeadline);
    if (applicationDeadlineDate > startDateTime) {
      this.showModalMessage('Rok za prijavu mora biti prije datuma početka događaja.');
      return;
    }

    this.event.startTime = startDateTime;
    this.event.endTime = endDateTime;
    this.event.status = status;
    
    let allSkills = [...this.selectedSkills];
    if (this.otherSkills) {
      const manualSkills = this.otherSkills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      allSkills = [...allSkills, ...manualSkills];
    }
    this.event.requiredSkills = allSkills;
    console.log(this.event);
    if (this.isEditMode && this.eventId) {
      this.modalAction = 'save';
      this.showModalMessage('Da li ste sigurni da želite da ažurirate ovaj događaj?');
    } else {
      this.eventService.checkOverlap(this.event.city, this.event.startTime, this.event.endTime)
        .subscribe({
          next: isOverlapping => {
            if (isOverlapping) {
              this.modalAction = 'overlap';
              this.showModalMessage('Događaj se preklapa sa drugim događajem u istom gradu. Želite li da nastavite?');
            } else {
              this.modalAction = 'save';
              this.showModalMessage('Da li ste sigurni da želite da kreirate ovaj događaj?');
            }
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
      Status: this.event.status,
      resourceRequests: this.event.resourceRequests
    };

    console.log('Finalni podaci koji se šalju servisu:', eventToSend);

    this.eventService.createEvent(eventToSend).subscribe({
      next: result => {
        this.toastService.success('Događaj uspješno kreiran!'); 
        this.router.navigate(['/layout/events']);
      }
    });
  }

  private updateEvent() {
    this.eventService.updateEvent(this.eventId!, this.event).subscribe({
      next: () => {
        this.toastService.success('Događaj uspješno ažuriran!'); 
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
      ForceCreate: this.event.forceCreate,
      Status: this.event.status,
      resourceRequests: this.event.resourceRequests
    };

    this.eventService.createEvent(eventToSend).subscribe({
      next: result => {
        this.toastService.success('Događaj uspješno kreiran uprkos preklapanju!'); 
        this.router.navigate(['/layout/events']);
      }
    });
  }

  showModalMessage(message: string) {
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalMessage = '';
    this.modalAction = 'none';
  }

  performModalAction() {
    this.showModal = false;
    if (this.modalAction === 'overlap') {
      this.createEventWithForceCreate();
    } else if (this.modalAction === 'save') {
      if (this.isEditMode) {
        this.updateEvent();
      } else {
        this.createEvent();
      }
    }
    this.modalAction = 'none';
  }

  getSuggestedSkills(eventType: string | null): string[] {
    if (eventType && this.skillSuggestions[eventType]) {
      return this.skillSuggestions[eventType];
    }
    return [];
  }

  openMarkdownHelp() {
    this.dialog.open(this.markdownHelpTemplate, {
      width: '600px',
    });
  }

  addResource() {
  const dialogRef = this.dialog.open(CreateResourceDialogComponent, {
    width: '450px',
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.event.resourceRequests.push({
        id: 0,
        eventId: 0,
        itemName: result.name,
        quantityNeeded: result.quantity,
        category: result.category,
        quantityFulfilled: result.quantityFulfilled,
        status: result.status
      });
    }
  });
  }

  removeResource(index: number) {
    this.event.resourceRequests.splice(index, 1);
  }

  getResourceCategoryName(categoryValue: string | number): string {
     if (typeof categoryValue === 'string') {
    return categoryValue;
  }
    return ResourceCategory[categoryValue];
  }

getCategoryClass(category: string | number): string {
  if (typeof category === 'number') {
    category = ResourceCategory[category];
  }

  switch (category) {
    case 'Oprema':
      return 'category-badge-equipment';
    case 'Hrana':
      return 'category-badge-food';
    case 'Piće':
      return 'category-badge-drink';
    case 'Prostor':
      return 'category-badge-space';
    case 'Prevoz':
      return 'category-badge-transport';
    case 'Materijal':
      return 'category-badge-material';
    case 'Ostalo':
      return 'category-badge-other';
    default:
      return 'category-badge-default';
  }
}

getCategoryIcon(category: string | number): string {
  if (typeof category === 'number') {
    category = ResourceCategory[category];
  }

  switch (category) {
    case 'Oprema':
      return 'chair';
    case 'Prostor':
      return 'location_on';
    case 'Prevoz':
      return 'directions_car';
    case 'Materijal':
      return 'build';
    case 'Hrana':
      return 'restaurant';
    case 'Piće':
      return 'liquor';
    case 'Ostalo':
      return 'more_horiz';
    default:
      return 'help_outline'; 
  }
}
}

