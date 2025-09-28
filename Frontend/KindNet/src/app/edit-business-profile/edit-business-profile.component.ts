import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { ProfileService } from '../services/profile.service';
import { BusinessProfile } from '../models/profiles.model';

@Component({
  selector: 'app-edit-business-profile',
  templateUrl: './edit-business-profile.component.html',
  styleUrls: ['./edit-business-profile.component.css']
})
export class EditBusinessProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isLoading = true;
  isNewProfile = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      city: ['', Validators.required],
      contactPhone: [''],
      description: [''],
      galleryImageUrls: this.fb.array([])
    });

    this.loadProfile();
  }

  get galleryArray(): FormArray {
    return this.profileForm.get('galleryImageUrls') as FormArray;
  }

  loadProfile(): void {
    this.profileService.getBusinessProfile().subscribe({
      next: (profile: BusinessProfile) => {
        console.log(profile);
        this.patchForm(profile);
        this.isNewProfile = false;
        this.isLoading = false;
      },
      error: (err) => {
        const message = (err instanceof Error) ? err.message : '';

        if (message.includes('Profile not found')) {
          this.isNewProfile = true;
          this.isLoading = false;
          this.toastService.info('Molimo kreirajte svoj biznis profil.');
        } else {
          this.isLoading = false;
          console.error('Greška pri učitavanju profila:', err);
          this.toastService.error('Greška pri učitavanju profila.');
        }
      }
    });
  }

  patchForm(profile: BusinessProfile): void {
    console.log(profile);
    this.profileForm.patchValue({
      name: profile.name,
      city: profile.city,
      contactPhone: profile.contactPhone,
      description: profile.description
    });

    this.galleryArray.clear();
    profile.galleryImageUrls?.forEach(url =>
      this.galleryArray.push(this.fb.control(url))
    );
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.galleryArray.push(this.fb.control(reader.result));
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removeGalleryUrl(index: number): void {
    this.galleryArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.profileService.createOrUpdateBusinessProfile(this.profileForm.value).subscribe({
        next: () => {
          this.toastService.success('Profil uspješno sačuvan!');
          this.isLoading = false;
          this.router.navigate(['/layout/business-profile']);
        },
        error: (err) => {
          this.toastService.error('Greška pri čuvanju profila.');
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }
}
