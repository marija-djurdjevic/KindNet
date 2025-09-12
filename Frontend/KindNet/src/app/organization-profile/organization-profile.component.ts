import { Component, OnInit } from '@angular/core';
import { OrganizationProfile } from '../models/profiles.model';
import { ProfileService } from '../services/profile.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.css']
})
export class OrganizationProfileComponent implements OnInit {
  profile: OrganizationProfile | null = null;
  isLoading = true;
  isProfileMissing = false;
  userEmail: string | null = null;
  currentIndex = 0;
  isLightboxOpen = false;
  currentImage: string | null = null;

  constructor(
    private profileService: ProfileService,
    private toastService: ToastService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadProfile();
    this.userEmail = this.authService.getUserEmail();
  }

  nextSlide(): void {
    if (!this.profile || !this.profile.galleryImageUrls) {
      return;
    }
    const totalImages = this.profile.galleryImageUrls.length;
    const remainingImages = totalImages - (this.currentIndex + 5);
    if (remainingImages > 0) {
      this.currentIndex += (remainingImages >= 5) ? 5 : remainingImages;
    }
  }

  prevSlide(): void {
    this.currentIndex = Math.max(0, this.currentIndex - 5);
  }

 openLightbox(url: string): void {
    this.currentImage = url;
    this.isLightboxOpen = true;
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    this.currentImage = null;
  }


  nextImage(): void {
    if (this.profile && this.currentImage) {
      const currentUrlIndex = this.profile.galleryImageUrls.indexOf(this.currentImage);
      if (currentUrlIndex < this.profile.galleryImageUrls.length - 1) {
        this.currentImage = this.profile.galleryImageUrls[currentUrlIndex + 1];
      }
    }
  }

  prevImage(): void {
    if (this.profile && this.currentImage) {
      const currentUrlIndex = this.profile.galleryImageUrls.indexOf(this.currentImage);
      if (currentUrlIndex > 0) {
        this.currentImage = this.profile.galleryImageUrls[currentUrlIndex - 1];
      }
    }
  }
   get hasMoreThanFiveImages(): boolean {
    return (this.profile?.galleryImageUrls?.length ?? 0) > 5;
  }

  get hasPreviousImages(): boolean {
    return this.currentIndex > 0;
  }

  get hasNextImages(): boolean {
    return (this.profile?.galleryImageUrls?.length ?? 0) > (this.currentIndex + 5);
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
