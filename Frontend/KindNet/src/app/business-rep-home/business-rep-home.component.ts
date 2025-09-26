import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { EventDto, EventStatus } from '../models/event.model';
import { ResourceService } from '../services/resource.service';
import { ResourceFulfillment, ResourceRequest, ResourceRequestDetailDto, ResourceRequestStatus } from '../models/resource.model';
import { DonationDialogComponent } from '../donation-dialog/donation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../services/toast.service';
import { ThankYouDialogComponent } from '../thank-you-dialog/thank-you-dialog.component';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-business-rep-home',
  templateUrl: './business-rep-home.component.html',
  styleUrls: ['./business-rep-home.component.css']
})
export class BusinessRepHomeComponent implements OnInit {
  events: EventDto[] = [];
  loading: boolean = true;
  now: Date = new Date();
  private audio = new Audio('assets/audio/success-340660.mp3');
  private statusTranslationMap = new Map<string, string>();
  private typeTranslationMap = new Map<string, string>();
  constructor(private eventService: EventService, private resourceService: ResourceService, public dialog: MatDialog, private toastService: ToastService) { }

  ngOnInit(): void {
  this.populateStatusMap();
  this.populateTypeMap(); 
   this.loadData();
  }

  loadData() {
     this.eventService.getPlannedAndActiveEvents().subscribe({
      next: (data) => {
        this.events = data;
        console.log(this.events);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.loading = false;
      }
    });
  }

   eventStatuses = [
      { value: EventStatus.Draft, name: 'Nacrt' },
      { value: EventStatus.Planned, name: 'Planiran' },
      { value: EventStatus.Active, name: 'Aktivan' },
      { value: EventStatus.Finished, name: 'Završen' },
      { value: EventStatus.Canceled, name: 'Otkazan' },
      { value: EventStatus.Archived, name: 'Arhiviran' },
  ];

  typeIconMapping: { [key: string]: string } = {
    'Environmental': 'eco',
    'Cultural': 'theater_comedy',
    'Educational': 'school',
    'Humanitarian': 'volunteer_activism',
    'Sport': 'sports_soccer',
    'Community': 'groups',
    'Technology': 'computer'
  };

  resourceIconMapping: { [key: string]: string } = {
  'Oprema': 'chair',
  'Prostor': 'location_on',
  'Prevoz': 'directions_car',
  'Materijal': 'build',
  'Hrana': 'restaurant',
  'Piće': 'liquor',
  'Ostalo': 'more_horiz'
};

  openDonationDialog(resource: ResourceRequestDetailDto): void {
    const neededQuantity = resource.quantityNeeded - (resource.quantityFulfilled || 0);
    const dialogRef = this.dialog.open(DonationDialogComponent, {
      width: '400px',
      data: { resource, neededQuantity },
      disableClose: true 
    });

  dialogRef.afterClosed().subscribe((result: number) => {
    if (result && result > 0) {
      const fulfillmentDto: ResourceFulfillment = {
        requestId: resource.id,
        quantityProvided: result,
        id: 0,
        providerUserId: 0,
        agreementTime: this.now
      };
      
      this.resourceService.createFulfillment(fulfillmentDto).subscribe({
        next: (response) => {
          const event = this.events.find(e => e.id === resource.eventId);

          if (event) {
            const resourceInEvent = event.resourceRequests.find(r => r.id === response.requestId);
            if (resourceInEvent) {
              resourceInEvent.quantityFulfilled = (resourceInEvent.quantityFulfilled || 0) + response.quantityProvided;
                confetti({
                    particleCount: 150,
                    spread: 180,
                    origin: { y: 0.6 }
                  });

                this.audio.play();
                 this.dialog.open(ThankYouDialogComponent, {
                  data: {
                    itemName: resource.itemName,
                    quantityProvided: response.quantityProvided
                  },
                  width: '400px',
                  panelClass: 'thank-you-dialog-panel'
                });
            }
          }
        }
      });
    }
  });
}

 private populateStatusMap(): void {
      for (const status of this.eventStatuses) {
        this.statusTranslationMap.set(EventStatus[status.value], status.name);
      }
    }

  public translateStatus(status: string): string {
    return this.statusTranslationMap.get(status) || status;
  }

  private populateTypeMap(): void {
    this.typeTranslationMap.set('Environmental', 'Ekološki');
    this.typeTranslationMap.set('Cultural', 'Kulturni');
    this.typeTranslationMap.set('Educational', 'Edukativni');
    this.typeTranslationMap.set('Humanitarian', 'Humanitarni');
    this.typeTranslationMap.set('Sport', 'Sportski');
    this.typeTranslationMap.set('Community', 'Društveni');
    this.typeTranslationMap.set('Technology', 'Tehnološki');
  }

   public translateType(type: string): string {
    return this.typeTranslationMap.get(type) || type;
  }
}