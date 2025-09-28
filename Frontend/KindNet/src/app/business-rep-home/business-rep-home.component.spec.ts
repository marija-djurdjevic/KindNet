import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRepHomeComponent } from './business-rep-home.component';

describe('BusinessRepHomeComponent', () => {
  let component: BusinessRepHomeComponent;
  let fixture: ComponentFixture<BusinessRepHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessRepHomeComponent]
    });
    fixture = TestBed.createComponent(BusinessRepHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
