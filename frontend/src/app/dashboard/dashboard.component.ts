import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  totalStudents = 0;

  totalCourses = 0;

  recentActivities: string[] = [];

  ngOnInit(): void {

    const students = JSON.parse(localStorage.getItem('students') || '[]');

    const courses = JSON.parse(localStorage.getItem('courses') || '[]');

    this.totalStudents = students.length;

    this.totalCourses = courses.length;

    this.recentActivities = [
      'Student Added',
      'Course Added',
      'Result Uploaded'
    ];
  }
}