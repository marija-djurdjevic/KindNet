import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationProfileComponent } from './organization-profile.component';

describe('OrganizationProfileComponent', () => {
  let component: OrganizationProfileComponent;
  let fixture: ComponentFixture<OrganizationProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationProfileComponent]
    });
    fixture = TestBed.createComponent(OrganizationProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
