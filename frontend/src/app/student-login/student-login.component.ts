import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toUserMessage } from '../shared/error-message.util';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-login.component.html',
  styleUrls: ['../login/login.component.css']
})
export class StudentLoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.loading = true;

    this.authService.loginStudent({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.mustChangePassword) {
          this.router.navigate(['/student/change-password']);
        } else {
          this.router.navigate(['/student/register-courses']);
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = toUserMessage(err, 'Invalid email or password');
      }
    });
  }
}
