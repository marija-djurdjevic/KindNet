import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerAttendanceModalComponent } from './volunteer-attendance-modal.component';

describe('VolunteerAttendanceModalComponent', () => {
  let component: VolunteerAttendanceModalComponent;
  let fixture: ComponentFixture<VolunteerAttendanceModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VolunteerAttendanceModalComponent]
    });
    fixture = TestBed.createComponent(VolunteerAttendanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
