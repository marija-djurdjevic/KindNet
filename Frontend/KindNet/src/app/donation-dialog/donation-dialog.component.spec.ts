import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationDialogComponent } from './donation-dialog.component';

describe('DonationDialogComponent', () => {
  let component: DonationDialogComponent;
  let fixture: ComponentFixture<DonationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DonationDialogComponent]
    });
    fixture = TestBed.createComponent(DonationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
