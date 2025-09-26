import { Component, OnInit } from '@angular/core';
import { OrganizationProfile } from '../models/profiles.model';
import { ProfileService } from '../services/profile.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router'; 
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-organization-profile',
  templateUrl: './organization-profile.component.html',
  styleUrls: ['./organization-profile.component.css']
})
export class OrganizationProfileComponent implements OnInit {
  profile: OrganizationProfile | null = null;
  isLoading = true;
  isProfileMissing = false;
  isOwnProfile = false;
  userEmail: string | null = null;
  currentIndex = 0;
  isLightboxOpen = false;
  currentImage: string | null = null;

  constructor(
    private profileService: ProfileService,
    private toastService: ToastService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // 4. Slušaj promene u URL-u
    this.route.paramMap.subscribe(params => {
      this.isLoading = true;
      this.profile = null;
      this.isProfileMissing = false;

      const userIdParam = params.get('userId');

      if (userIdParam) {
        // Prikazujemo tuđi profil
        this.isOwnProfile = false;
        const userId = parseInt(userIdParam, 10);
        this.loadProfileByUserId(userId);
      } else {
        // Prikazujemo sopstveni profil
        this.isOwnProfile = true;
        this.userEmail = this.authService.getUserEmail();
        this.loadMyProfile();
      }
    });
  }

  loadMyProfile(): void {
    this.profileService.getOrganizationProfile().subscribe({
      next: (profile: OrganizationProfile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => this.handleProfileError(err)
    });
  }

  loadProfileByUserId(userId: number): void {
    this.profileService.getOrganizationProfileByUserId(userId).subscribe({
      next: (profile: OrganizationProfile) => {
        this.profile = profile;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => this.handleProfileError(err)
    });
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


   private handleProfileError(err: HttpErrorResponse): void {
    const message = err.error?.message || err.message;
    if (err.status === 404 || message.includes('Profile not found')) {
      this.isProfileMissing = true;
      this.toastService.info('Korisnik nema kreiran profil organizacije.');
    } else {
      this.toastService.error('Greška pri učitavanju profila.');
      console.error('Greška pri učitavanju profila organizacije:', err);
    }
    this.isLoading = false;
  }
}
