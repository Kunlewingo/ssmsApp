import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentService } from '../services/student.service';
import { CourseService } from '../services/course.service';
import { RegistrationService } from '../services/registration.service';
import { toUserMessage } from '../shared/error-message.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalStudents = 0;
  totalCourses = 0;
  totalRegistrations = 0;
  loadError = '';

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => this.totalStudents = data.length,
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load student count. Please refresh.')
    });
    this.courseService.getCourses().subscribe({
      next: (data) => this.totalCourses = data.length,
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load course count. Please refresh.')
    });
    this.registrationService.getAllRegistrations().subscribe({
      next: (data) => this.totalRegistrations = data.length,
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load registration count. Please refresh.')
    });
  }
}
