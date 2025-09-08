import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

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

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit(): void { }

  onRegister(): void {
    const credentials = { email: this.email, password: this.password, role: this.role };
    this.authService.register(credentials).subscribe({
      next: (response) => {
        this.toastService.success('Uspješna registracija! Sada se možete prijaviti.');
        this.router.navigate(['/login']); 
      }
    });
  }
}