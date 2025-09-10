import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { ProfileService } from '../services/profile.service';
import { OrganizationProfile } from '../models/profiles.model';

@Component({
  selector: 'app-edit-organization-profile',
  templateUrl: './edit-organization-profile.component.html',
  styleUrls: ['./edit-organization-profile.component.css']
})
export class EditOrganizationProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isLoading = true;
  isNewProfile = false;

  predefinedAreas: string[] = [
    'Obrazovanje',
    'Zdravstvo',
    'Ekologija',
    'Kultura',
    'Sport',
    'Socijalna zaštita',
    'Tehnologija',
    'Ljudska prava'
  ];
selectedPredefinedAreas: string[] = [];
customActivityArea = '';

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
      description: [''],
      contactPhone: [''],
      website: [''],
      galleryImageUrls: this.fb.array([]),
      activityAreas: this.fb.array([])
    });

    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getOrganizationProfile().subscribe({
      next: (profile: OrganizationProfile) => {
        this.patchForm(profile);
        this.isNewProfile = false;
        this.isLoading = false;
      },
      error: (err) => {
        const message = (err instanceof Error) ? err.message : '';

        if (message.includes('Profile not found')) {
          this.isNewProfile = true;
          this.isLoading = false;
          this.toastService.info('Molimo kreirajte svoj profil.');
        } else {
          this.isLoading = false;
          console.error('Nepoznata greška pri učitavanju profila:', err);
          this.toastService.error('Greška pri učitavanju profila.');
        }
      }
    });
  }

  patchForm(profile: OrganizationProfile): void {
    this.profileForm.patchValue({
      name: profile.name,
      city: profile.city,
      description: profile.description,
      contactPhone: profile.contactPhone,
      website: profile.website
    });

    this.galleryArray.clear();
    profile.galleryImageUrls?.forEach(url => this.galleryArray.push(this.fb.control(url)));

    this.activityArray.clear();
    profile.activityAreas?.forEach(area => {
        if (area) {
            this.activityArray.push(this.fb.control(area));
        }
    });
  }

  addCustomActivityArea(): void {
    const customArea = this.customActivityArea.trim();
    if (customArea && !this.activityArray.value.includes(customArea)) {
        this.activityArray.push(this.fb.control(customArea));
        this.customActivityArea = ''; 
    }
}

toggleActivityArea(area: string): void {
    const index = this.activityArray.value.indexOf(area);
    if (index === -1) {
        this.activityArray.push(this.fb.control(area));
    } else {
        this.activityArray.removeAt(index);
    }
}

removeActivityArea(index: number): void {
    this.activityArray.removeAt(index);
}

  get galleryArray(): FormArray {
    return this.profileForm.get('galleryImageUrls') as FormArray;
  }

  get activityArray(): FormArray {
    return this.profileForm.get('activityAreas') as FormArray;
  }

  addGalleryUrl(file?: File): void {
    if (file) {
      const url = URL.createObjectURL(file);
      this.galleryArray.push(this.fb.control(url));
    } else {
      this.galleryArray.push(this.fb.control(''));
    }
  }

  removeGalleryUrl(index: number): void {
    this.galleryArray.removeAt(index);
  }

  addActivityArea(): void {
    this.activityArray.push(this.fb.control(''));
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


  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.profileService.createOrUpdateOrganizationProfile(this.profileForm.value).subscribe({
        next: () => {
          this.toastService.success('Profil uspješno sačuvan!');
          this.isLoading = false;
          this.patchForm(this.profileForm.value as OrganizationProfile);
          this.router.navigate(['/layout/organization-profile']);
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
