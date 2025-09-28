import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUsersDashboardComponent } from './top-users-dashboard.component';

describe('TopUsersDashboardComponent', () => {
  let component: TopUsersDashboardComponent;
  let fixture: ComponentFixture<TopUsersDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopUsersDashboardComponent]
    });
    fixture = TestBed.createComponent(TopUsersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
