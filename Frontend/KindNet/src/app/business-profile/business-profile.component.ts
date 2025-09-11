import { Component, OnInit } from '@angular/core';
import { BusinessProfile } from '../models/profiles.model';
import { ProfileService } from '../services/profile.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit {
  profile: BusinessProfile | null = null;
  isLoading = true;
  isProfileMissing = false;
  currentIndex = 0;
  isLightboxOpen = false;
  currentImage: string | null = null;

  constructor(
    private profileService: ProfileService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getBusinessProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (err) => {
        const message = (err instanceof Error) ? err.message : '';
        if (message.includes('Profile not found')) {
          this.isProfileMissing = true;
          this.isLoading = false;
          this.toastService.info('Nemate kreiran business profil.');
        } else {
          this.isLoading = false;
          this.toastService.error('Greška pri učitavanju profila.');
          console.error('Greška pri učitavanju business profila:', err);
        }
      }
    });
  }



nextSlide(): void {
  if (!this.profile?.galleryImageUrls) return;
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
    const currentIndex = this.profile.galleryImageUrls.indexOf(this.currentImage);
    if (currentIndex < this.profile.galleryImageUrls.length - 1) {
      this.currentImage = this.profile.galleryImageUrls[currentIndex + 1];
    }
  }
}

prevImage(): void {
  if (this.profile && this.currentImage) {
    const currentIndex = this.profile.galleryImageUrls.indexOf(this.currentImage);
    if (currentIndex > 0) {
      this.currentImage = this.profile.galleryImageUrls[currentIndex - 1];
    }
  }
}

get hasPreviousImages(): boolean {
  return this.currentIndex > 0;
}

get hasNextImages(): boolean {
  return (this.profile?.galleryImageUrls?.length ?? 0) > (this.currentIndex + 5);
}

}
