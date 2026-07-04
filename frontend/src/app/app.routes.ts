import { Routes } from '@angular/router';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Students
import { AddStudentComponent } from './students/add-student/add-student.component';
import { ViewStudentComponent } from './students/view-student/view-student.component';

// Results
import { AddResultsComponent } from './results/add-result/add-result.component';
import { ViewResultsComponent } from './results/view-result/view-result.component';

export const routes: Routes = [

  // Open directly to dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // Dashboard
  {
    path: 'dashboard',
    component: DashboardComponent
  },

  // Students
  {
    path: 'add-student',
    component: AddStudentComponent
  },

  {
    path: 'view-student',
    component: ViewStudentComponent
  },

  // Results
  {
    path: 'add-result',
    component: AddResultsComponent
  },

  {
    path: 'view-result',
    component: ViewResultsComponent
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'dashboard'
  }

];