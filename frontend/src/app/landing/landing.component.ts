import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  constructor(private router: Router) {}

  goToAdminLogin() { this.router.navigate(['/login']); }
  goToStudentLogin() { this.router.navigate(['/student-login']); }
}
