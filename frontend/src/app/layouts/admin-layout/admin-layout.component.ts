import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/view-student', label: 'Students', icon: '🎓' },
    { path: '/admin/faculties', label: 'Faculties', icon: '🏛️' },
    { path: '/admin/departments', label: 'Departments', icon: '🏢' },
    { path: '/view-course', label: 'Courses', icon: '📚' },
    { path: '/view-result', label: 'Results', icon: '📝' },
    { path: '/admin/registrations', label: 'Registrations', icon: '📋' },
  ];

  sidebarOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
