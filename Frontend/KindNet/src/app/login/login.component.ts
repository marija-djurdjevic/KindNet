import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void { }

  onLogin(): void {
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful!', response);
        this.router.navigate(['/layout']); 
      }
    });
  }
}