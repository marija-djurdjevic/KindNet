import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  email = '';
  password = '';
  role = 'Volunteer';
  roles = ['Volunteer', 'OrganizationRep', 'BusinessRep'];
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }

  onRegister(): void {
    const credentials = { email: this.email, password: this.password, role: this.role };
    console.log(credentials);
    this.authService.register(credentials).subscribe({
      next: (response) => {
        console.log('Registration successful!', response);
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage = error.error;
      }
    });
  }
}
