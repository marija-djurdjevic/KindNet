import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  canActivate() {
    return this.profileService.getVolunteerProfile().pipe(
      map(() => true), // ima profil → može dalje
      catchError((err) => {
        if (err.status === 404) {
          // nema profil → preusmjeri na kreiranje profila
          this.router.navigate(['/layout/user-profile/edit']);
          return of(false);
        }
        // neka druga greška → može fallback na false ili true
        return of(false);
      })
    );
  }
}
