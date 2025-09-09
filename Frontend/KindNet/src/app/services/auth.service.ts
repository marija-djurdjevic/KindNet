import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7200/api/auth'; 
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient,
    private router: Router,
    private profileService: ProfileService
  ) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt');
  }

  register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, credentials);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.accessToken) {
          localStorage.setItem('jwt', response.accessToken);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.isLoggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

   public getRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
         const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        return decodedToken[roleClaim]; 
      } catch (error) {
        console.error('Greška pri dekodiranju tokena:', error);
        this.logout();
        return null;
      }
    }
    return null;
  }

   public isOrganizer(): boolean {
    const role = this.getRole();
    return role === 'OrganizationRep' || role === 'BusinessRep';
  }

  public getUserEmail(): string | null {
  const token = this.getToken();
  if (token) {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const emailClaim = 'email';
      return decodedToken[emailClaim];
    } catch (error) {
      console.error('Greška pri dekodiranju tokena za email:', error);
      return null;
    }
  }
  return null;
}

}
