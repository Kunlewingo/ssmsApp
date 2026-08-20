import { Routes } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { StudentLoginComponent } from './student-login/student-login.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddStudentComponent } from './students/add-student/add-student.component';
import { ViewStudentComponent } from './students/view-student/view-student.component';
import { AddResultsComponent } from './results/add-result/add-result.component';
import { ViewResultsComponent } from './results/view-result/view-result.component';
import { AddCourseComponent } from './courses/add-course/add-course.component';
import { ViewCourseComponent } from './courses/view-course/view-course.component';

import { CourseRegistrationComponent } from './students/course-registration/course-registration.component';
import { GpaSummaryComponent } from './students/gpa-summary/gpa-summary.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

import { RegistrationsOverviewComponent } from './admin/registrations-overview/registrations-overview.component';
import { FacultyManagementComponent } from './admin/faculty-management/faculty-management.component';
import { DepartmentManagementComponent } from './admin/department-management/department-management.component';
import { StudentProfileComponent } from './admin/student-profile/student-profile.component';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },

  { path: 'login', component: LoginComponent },
  { path: 'student-login', component: StudentLoginComponent },

  // Standalone (no sidebar) — shown right after a temp-password login, before
  // the student can reach any other student page.
  {
    path: 'student/change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard, roleGuard(['student'])]
  },

  // Admin area — everything below renders inside AdminLayoutComponent's sidebar shell
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'add-student', component: AddStudentComponent },
      { path: 'view-student', component: ViewStudentComponent },
      { path: 'add-course', component: AddCourseComponent },
      { path: 'view-course', component: ViewCourseComponent },
      { path: 'add-result', component: AddResultsComponent },
      { path: 'view-result', component: ViewResultsComponent },
      { path: 'admin/registrations', component: RegistrationsOverviewComponent },
      { path: 'admin/faculties', component: FacultyManagementComponent },
      { path: 'admin/departments', component: DepartmentManagementComponent },
      { path: 'admin/students/:id', component: StudentProfileComponent },
    ]
  },

  // Student area — renders inside StudentLayoutComponent's sidebar shell
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [authGuard, roleGuard(['student'])],
    children: [
      { path: 'register-courses', component: CourseRegistrationComponent },
      { path: 'gpa', component: GpaSummaryComponent },
    ]
  },

  { path: '**', redirectTo: '' }
];
