import { Component, OnInit } from '@angular/core';
import { BusinessProfile } from '../models/profiles.model';
import { ProfileService } from '../services/profile.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.css']
})
export class BusinessProfileComponent implements OnInit {
  profile: BusinessProfile | null = null;
  isLoading = true;
  isProfileMissing = false;
  isOwnProfile = false;
  currentIndex = 0;
  isLightboxOpen = false;
  currentImage: string | null = null;
  userEmail: string | null = null;

  constructor(
    private profileService: ProfileService,
    private toastService: ToastService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.isLoading = true; 
      this.profile = null;
      this.isProfileMissing = false;
      const userIdParam = params.get('userId');
      if (userIdParam) {
        this.isOwnProfile = false;
        const userId = parseInt(userIdParam, 10);
        this.loadProfileByUserId(userId);
      } else {
        this.isOwnProfile = true;
        this.userEmail = this.authService.getUserEmail();
        this.loadMyProfile();
      }
    });
  }

   loadMyProfile(): void {
    this.profileService.getBusinessProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => this.handleProfileError(err)
    });
  }

  loadProfileByUserId(userId: number): void {
    this.profileService.getBusinessProfileByUserId(userId).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => this.handleProfileError(err)
    });
  }


   private handleProfileError(err: any): void {
    const message = err.error?.message || err.message;
    if (message.includes('Profile not found')) {
      this.isProfileMissing = true;
      this.toastService.info('Korisnik nema kreiran poslovni profil.');
    } else {
      this.toastService.error('Greška pri učitavanju profila.');
      console.error('Greška pri učitavanju poslovnog profila:', err);
    }
    this.isLoading = false;
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
