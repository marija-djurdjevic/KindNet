import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AttendanceRecord, SaveAttendanceRecord } from '../models/volunteer-attendance.model';
import { EventDto } from '../models/event.model';
import { EventService } from '../services/event.service';
import { ToastService } from '../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';

@Component({
  selector: 'app-volunteer-attendance-modal',
  templateUrl: './volunteer-attendance-modal.component.html',
  styleUrls: ['./volunteer-attendance-modal.component.css']
})
export class VolunteerAttendanceModalComponent {
   event: EventDto | null = null;
  attendanceRecords: AttendanceRecord[] = [];
  eventDates: Date[] = [];
  isLoading = true;
  isSaving = false;
  AttendanceStatus = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private toastService: ToastService
  ) { }

   ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const eventId = Number(params.get('id'));
        if (isNaN(eventId) || eventId <= 0) {
          this.toastService.error('Neispravan ID događaja.');
          this.router.navigate(['/layout/events']);
          return of(null);
        }
        return this.eventService.getEventById(eventId);
      }),
      switchMap(eventData => {
        if (eventData) {
          this.event = eventData;
          if(this.event){
            this.generateEventDates(this.event.startTime, this.event.endTime);
            return this.eventService.getAttendanceForEvent(this.event.id);
          }
          else{
            return of([]); 
          }
        } else {
          return of([]); 
        }
      })
    ).subscribe({
      next: (attendanceData) => {
        this.attendanceRecords = attendanceData;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error('Greška pri učitavanju podataka.');
        this.isLoading = false;
        this.router.navigate(['/layout/events']);
      }
    });
  }

  private generateEventDates(start: Date, end: Date): void {
    const dates = [];
    let currentDate = new Date(start);
    const endDate = new Date(end);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    this.eventDates = dates;
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isDateEditable(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  }

  setAttendanceStatus(record: AttendanceRecord, date: Date, status: boolean): void {
  const dateKey = this.formatDate(date);
  const daily = record.dailyRecords[dateKey];
    if (!daily) {
      record.dailyRecords[dateKey] = { hoursVolunteered: 0, status: status };
      return;
    }

    if (daily.status === status) {
      delete record.dailyRecords[dateKey];
    } else {
      daily.status = status;
    }
  }

  onSave(): void {
    if (!this.event) return;
    this.isSaving = true;
    
    const recordsToSave: SaveAttendanceRecord[] = [];
        for (const record of this.attendanceRecords) {
      for (const dateKey in record.dailyRecords) {
        const dailyRecord = record.dailyRecords[dateKey];
        if (dailyRecord !== undefined) {
        recordsToSave.push({
          applicationId: record.applicationId,
          sessionDate: dateKey,
          hoursVolunteered: dailyRecord.status === true ? dailyRecord.hoursVolunteered : 0,
          status: dailyRecord.status
        });
      }
    }
     }
    
    
    this.eventService.saveAttendance(this.event.id, recordsToSave).subscribe({
      next: () => {
        this.toastService.success('Evidencija uspešno sačuvana!');
        this.isSaving = false;
        this.router.navigate(['/layout/events']);
      },
      error: (err) => {
        this.toastService.error('Greška pri čuvanju evidencije.');
        this.isSaving = false;
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/layout/events']);
  }

    onHoursChange(record: AttendanceRecord, date: Date, hours: number | null): void {
      const dateKey = this.formatDate(date);
      const daily = record.dailyRecords[dateKey];

      if (!daily) {
        return;
      }

      let validHours = hours ?? 0;

      if (validHours < 0) {
        validHours = 0;
        this.toastService.warning('Broj sati ne može biti negativan.');
      } else if (validHours > 24) {
        validHours = 24;
        this.toastService.warning('Broj sati za jedan dan ne može biti veći od 24.');
      }

      daily.hoursVolunteered = validHours;
    }
}
