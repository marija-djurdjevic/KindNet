import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { ProfileService } from '../services/profile.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastService: ToastService,
    private profileService: ProfileService   
  ) { }

  ngOnInit(): void { }


  /*onLogin(): void {
  const credentials = { email: this.email, password: this.password };

  this.authService.login(credentials).subscribe({
    next: () => {
      this.profileService.getVolunteerProfile().subscribe({
        next: () => {
          this.router.navigate(['/layout']);
        },
        error: (err) => {
          console.error('Greška pri provjeri profila', err);
          const message = (err instanceof Error) ? err.message : '';
          if (message.includes('Profile not found')) {
            this.router.navigate(['/layout/user-profile/edit']);
          } else {
            this.router.navigate(['/layout']);
          }
        }
      });
    },
    error: (err) => {
      console.error('Login nije uspio', err);
      this.toastService.error('Neuspješno prijavljivanje. Provjerite podatke.');
    }
  });
}*/

onLogin(): void {
  const credentials = { email: this.email, password: this.password };

  this.authService.login(credentials).subscribe({
    next: () => {
      const role = this.authService.getRole();

      if (role === 'Volunteer') {
        this.profileService.getVolunteerProfile().subscribe({
          next: () => this.router.navigate(['/layout']),
          error: (err) => {
            if (err instanceof Error && err.message.includes('Profile not found')) {
              this.router.navigate(['/layout/user-profile/edit']);
            } else {
              this.router.navigate(['/layout']);
            }
          }
        });
      } 
      else if (role === 'OrganizationRep') {
        this.profileService.getOrganizationProfile().subscribe({
          next: () => this.router.navigate(['/layout']),
          error: (err) => {
            if (err instanceof Error && err.message.includes('Profile not found')) {
              this.router.navigate(['/layout/organization-profile/edit']);
            } else {
              this.router.navigate(['/layout']);
            }
          }
        });
      } 
      else {
        // druge uloge ili fallback
        this.router.navigate(['/layout']);
      }
    },
    error: (err) => {
      console.error('Login nije uspio', err);
      this.toastService.error('Neuspješno prijavljivanje. Provjerite podatke.');
    }
  });
}


}