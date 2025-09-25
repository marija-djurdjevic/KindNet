import { Component, OnDestroy, OnInit } from '@angular/core';
import { VolunteerProfile } from '../models/profiles.model';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router'; 

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  volunteerProfile: VolunteerProfile | null = null;
  userEmail: string | null = null;
  isLoading = true;
  isOwnProfile = false;
  error = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoading = true;
      this.volunteerProfile = null;
      this.error = '';

      const userIdParam = params.get('userId');

      if (userIdParam) {
        // Prikazujemo tuđi profil
        this.isOwnProfile = false;
        const userId = parseInt(userIdParam, 10);
        if (!isNaN(userId) && userId > 0) {
          this.loadProfileByUserId(userId);
        } else {
          this.error = 'Neispravan ID korisnika.';
          this.isLoading = false;
        }
      } else {
        // Prikazujemo sopstveni profil
        this.isOwnProfile = true;
        this.userEmail = this.authService.getUserEmail();
        this.loadMyProfile();
      }
    });
  }
  
  loadMyProfile(): void {
    this.profileService.getVolunteerProfile().subscribe({
      next: (profile: VolunteerProfile) => {
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

  loadProfileByUserId(userId: number): void {
    this.profileService.getVolunteerProfileByUserId(userId).subscribe({
      next: (profile: VolunteerProfile) => {
        this.volunteerProfile = profile;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.error = 'Profil traženog volontera nije pronađen.';
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