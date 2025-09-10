import { Component, OnDestroy, OnInit } from '@angular/core';
import { VolunteerProfile } from '../models/profiles.model';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  volunteerProfile: VolunteerProfile | null = null;
  userEmail: string | null = null;
  isLoading = true;
  error = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.userEmail = this.authService.getUserEmail();
    this.profileService.getVolunteerProfile().subscribe({
      next: (profile) => {
        this.volunteerProfile = profile;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.router.navigate(['/layout/user-profile/edit']);
        } else {
          this.error = 'Greška pri učitavanju profila. Molimo Vas da pokušate ponovo.';
          console.error('API Error:', err);
        }
      }
    });
  }
  
  onEditProfileClick(): void {
    this.router.navigate(['/layout/user-profile/edit']);
  }
}