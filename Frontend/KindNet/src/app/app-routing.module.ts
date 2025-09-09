import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout/layout.component';
import { EventsListComponent } from './events-list/events-list.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ApplicationsDashboardComponent } from './applications-dashboard/applications-dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditVolunteerProfileComponent } from './edit-volunteer-profile/edit-volunteer-profile.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'home', component: HomeComponent },

  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      { path: 'events', component: EventsListComponent },
      { path: 'create-event', component: CreateEventComponent },
      { path: 'create-event/:id', component: CreateEventComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'events-applications', component: ApplicationsDashboardComponent },
      { path: 'user-profile', component: UserProfileComponent }, 
      { path: 'user-profile/edit', component: EditVolunteerProfileComponent }
    ]
  },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }