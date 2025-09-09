import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VolunteerProfile, VolunteerProfileDto } from '../models/profiles.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfileService } from '../services/profile.service';
import { ToastService } from '../services/toast.service'; 

@Component({
  selector: 'app-edit-volunteer-profile',
  templateUrl: './edit-volunteer-profile.component.html',
  styleUrls: ['./edit-volunteer-profile.component.css']
})
export class EditVolunteerProfileComponent implements OnInit{
    profileForm: FormGroup;
    isLoading = true;
    isNewProfile = false;

    separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private toastService: ToastService, 
        private router: Router
    ) {
        console.log('EditVolunteerProfileComponent: constructor se poziva.');
        this.profileForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            city: ['', Validators.required],
            contactPhone: [''],
            skills: [[]],
            interests: [[]]
        });
    }

suggestedSkills: string[] = [
  'Organizacija događaja', 'Komunikacija', 'Rad u timu', 'Pisanje izveštaja',
  'Marketing', 'Fotografija', 'Dizajn', 'IT veštine', 'Edukacija', 'Mentorstvo',
  'Logistika', 'Planiranje', 'Kreativnost', 'Volontersko iskustvo'
];

suggestedInterests: string[] = [
  'Životna sredina', 'Obrazovanje', 'Sport', 'Kultura', 'Zdravlje', 'Tehnologija',
  'Humanitarni rad', 'Muzika', 'Umjetnost', 'Psihologija', 'Deca i omladina', 'Stariji građani',
  'Putovanja', 'Zajednica'
];

toggleSkill(skill: string): void {
  const skills = this.profileForm.get('skills')?.value || [];
  const index = skills.indexOf(skill);
  if (index === -1) skills.push(skill);
  else skills.splice(index, 1);
  this.profileForm.get('skills')?.setValue(skills);
}

toggleInterest(interest: string): void {
  const interests = this.profileForm.get('interests')?.value || [];
  const index = interests.indexOf(interest);
  if (index === -1) interests.push(interest);
  else interests.splice(index, 1);
  this.profileForm.get('interests')?.setValue(interests);
}

  ngOnInit(): void {
    this.loadProfileData();
  }

  loadProfileData(): void {
  this.profileService.getVolunteerProfile().subscribe({
    next: (profile: VolunteerProfile) => {
      this.profileForm.patchValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        city: profile.city,
        contactPhone: profile.contactPhone,
        skills: profile.skills || [],
        interests: profile.interests || []
      });
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
      }
    }
  });
}

    onSubmit(): void {
        if (this.profileForm.valid) {
            this.isLoading = true;
            const profileDto: VolunteerProfileDto = this.profileForm.value;

            this.profileService.updateVolunteerProfile(profileDto).subscribe({
                next: () => {
                    this.toastService.success('Profil uspješno sačuvan!'); 
                    this.isLoading = false;
                    this.router.navigate(['/layout/user-profile']);
                },
                error: (err) => {
                    this.toastService.error('Greška pri čuvanju profila.'); 
                    this.isLoading = false;
                    console.error('Greška pri slanju podataka:', err);
                }
            });
        }
    }
    
    addSkill(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        const skills = this.profileForm.get('skills')?.value;
        skills.push(value.trim());
        this.profileForm.get('skills')?.setValue(skills);
      }

      if (input) {
        input.value = '';
      }
    }

    removeSkill(skill: string): void {
      const skills = this.profileForm.get('skills')?.value;
      const index = skills.indexOf(skill);

      if (index >= 0) {
        skills.splice(index, 1);
        this.profileForm.get('skills')?.setValue(skills);
      }
    }

    addInterest(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;

      if ((value || '').trim()) {
        const interests = this.profileForm.get('interests')?.value;
        interests.push(value.trim());
        this.profileForm.get('interests')?.setValue(interests);
      }

      if (input) {
        input.value = '';
      }
    }

    removeInterest(interest: string): void {
      const interests = this.profileForm.get('interests')?.value;
      const index = interests.indexOf(interest);

      if (index >= 0) {
        interests.splice(index, 1);
        this.profileForm.get('interests')?.setValue(interests);
      }
    }
}