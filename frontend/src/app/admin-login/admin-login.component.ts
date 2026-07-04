import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {

  username: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    const loginData = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>('http://localhost:5000/api/admin/login', loginData)
      .subscribe({

        next: (res) => {

          console.log(res);

          // Save admin login
          localStorage.setItem('admin', res.admin);

          // Redirect to dashboard
          this.router.navigate(['/dashboard']);

        },

        error: (err) => {

          console.log(err);

          alert('Invalid username or password');

        }

      });

  }

}