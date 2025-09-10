import { Component, OnInit } from '@angular/core';
import { OrganizationProfile } from '../models/profiles.model';
import { ProfileService } from '../services/profile.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.css']
})
export class OrganizationProfileComponent implements OnInit {
  profile: OrganizationProfile | null = null;
  isLoading = true;
  isProfileMissing = false;

  constructor(
    private profileService: ProfileService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getOrganizationProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (err) => {
        const message = (err instanceof Error) ? err.message : '';
        if (message.includes('Profile not found')) {
          this.isProfileMissing = true;
          this.isLoading = false;
          this.toastService.info('Nemate kreiran profil organizacije.');
        } else {
          this.isLoading = false;
          this.toastService.error('Greška pri učitavanju profila.');
          console.error('Greška pri učitavanju organizacijskog profila:', err);
        }
      }
    });
  }
}
