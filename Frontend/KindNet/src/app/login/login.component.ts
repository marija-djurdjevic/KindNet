import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  onLogin(): void {
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        this.router.navigate(['/layout']); 
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error;
      }
    });
  }
}
