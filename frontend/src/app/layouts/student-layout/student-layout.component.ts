import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.css']
})
export class StudentLayoutComponent implements OnInit {

  navItems = [
    { path: '/student/register-courses', label: 'Register Courses', icon: '📚' },
    { path: '/student/gpa', label: 'My GPA', icon: '📈' },
  ];

  sidebarOpen = false;
  studentName = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (student) => {
        this.studentName = student?.name || '';
        // Catches direct URL navigation that skips the login redirect —
        // students can't reach registration/GPA pages with a temp password active.
        if (student?.mustChangePassword) {
          this.router.navigate(['/student/change-password']);
        }
      },
      // Sidebar isn't a good place for an error banner — degrade quietly to a
      // generic label rather than leaving it blank if the profile fetch fails.
      error: () => this.studentName = 'Student'
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
