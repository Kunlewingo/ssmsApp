import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { FacultyService } from '../../services/faculty.service';
import { DepartmentService } from '../../services/department.service';
import { Course, Faculty, Department } from '../../models/course.model';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {

  faculties: Faculty[] = [];
  departments: Department[] = [];

  selectedFacultyId = '';

  course: Course = {
    courseName: '',
    courseCode: '',
    description: '',
    department: '',
    level: 100,
    type: 'compulsory',
    units: 3,
    semester: 'first'
  };

  levels = [100, 200, 300, 400, 500];

  constructor(
    private courseService: CourseService,
    private facultyService: FacultyService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe(data => this.faculties = data);
  }

  onFacultyChange(): void {
    this.departments = [];
    this.course.department = '';
    if (this.selectedFacultyId) {
      this.departmentService.getByFaculty(this.selectedFacultyId).subscribe(data => this.departments = data);
    }
  }

  addCourse(): void {
    if (!this.course.courseName || !this.course.courseCode || !this.course.department) {
      alert('Please complete all required fields.');
      return;
    }

    this.courseService.addCourse(this.course).subscribe({
      next: () => {
        alert('Course Added Successfully');
        this.resetForm();
      },
      error: (err) => alert(err.error?.message || 'Failed to add course.')
    });
  }

  resetForm(): void {
    this.course = {
      courseName: '', courseCode: '', description: '',
      department: this.course.department, // keep department selected for rapid entry of multiple courses
      level: 100, type: 'compulsory', units: 3, semester: 'first'
    };
  }
}
