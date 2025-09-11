import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './layout/layout.module';
import { MatIconModule } from '@angular/material/icon'; 
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatButtonModule } from '@angular/material/button';
import { registerLocaleData } from '@angular/common'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import { JwtModule } from '@auth0/angular-jwt';
import localeSr from '@angular/common/locales/sr-Latn';
registerLocaleData(localeSr);
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MarkdownModule } from 'ngx-markdown'; 
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error-interceptor.interceptor'; 
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventsListComponent } from './events-list/events-list.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ApplicationsDashboardComponent } from './applications-dashboard/applications-dashboard.component';
import { CreateResourceDialogComponent } from './create-resource-dialog/create-resource-dialog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditVolunteerProfileComponent } from './edit-volunteer-profile/edit-volunteer-profile.component';
import { EditOrganizationProfileComponent } from './edit-organization-profile/edit-organization-profile.component';
import { OrganizationProfileComponent } from './organization-profile/organization-profile.component';
import { EditBusinessProfileComponent } from './edit-business-profile/edit-business-profile.component';
import { BusinessProfileComponent } from './business-profile/business-profile.component';

export function tokenGetter() {
  return localStorage.getItem('jwt');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    EventsListComponent,
    CreateEventComponent,
    CalendarComponent,
    ApplicationsDashboardComponent,
    CreateResourceDialogComponent,
    UserProfileComponent,
    EditVolunteerProfileComponent,
    EditOrganizationProfileComponent,
    OrganizationProfileComponent,
    EditBusinessProfileComponent,
    BusinessProfileComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    LayoutModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MarkdownModule.forRoot(),
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatExpansionModule,
    MatCheckboxModule,
    MatListModule,
    MatChipsModule,
    MatTooltipModule,
    BrowserAnimationsModule, 
    ReactiveFormsModule,
    MatTableModule,
     ToastrModule.forRoot({
      positionClass: 'toast-bottom-right' 
    }),
     JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:7200"], 
      }
    }),
    ReactiveFormsModule,
    MatSnackBarModule
  ],

   providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
     {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true 
    }
  ],
  
  bootstrap: [AppComponent]
})

export class AppModule { }
