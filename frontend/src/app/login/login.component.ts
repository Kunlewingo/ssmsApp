import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  username = '';
  password = '';
  error = '';

  constructor(private router: Router) {}

  login() {

    if (this.username === 'admin' && this.password === 'admin') {

      localStorage.setItem('token', 'logged-in');

      this.router.navigate(['/dashboard']);

    } else {
      this.error = 'Invalid username or password';
    }
  }
}