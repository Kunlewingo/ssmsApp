import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyService } from '../../services/faculty.service';
import { DepartmentService } from '../../services/department.service';
import { Faculty, Department } from '../../models/course.model';

@Component({
  selector: 'app-department-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css']
})
export class DepartmentManagementComponent implements OnInit {

  faculties: Faculty[] = [];
  departments: Department[] = [];

  selectedFacultyId = '';

  newDept = {
    name: '',
    durationYears: 4 as 4 | 5,
    electiveMin: 2,
    electiveMax: 3
  };

  submitting = false;
  error = '';

  constructor(
    private facultyService: FacultyService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe(data => this.faculties = data);
  }

  onFacultyChange(): void {
    this.departments = [];
    if (this.selectedFacultyId) {
      this.loadDepartments();
    }
  }

  loadDepartments(): void {
    this.departmentService.getByFaculty(this.selectedFacultyId).subscribe(data => this.departments = data);
  }

  addDepartment(): void {
    if (!this.selectedFacultyId || !this.newDept.name.trim()) return;

    this.submitting = true;
    this.error = '';

    this.departmentService.addDepartment({
      name: this.newDept.name.trim(),
      faculty: this.selectedFacultyId,
      durationYears: this.newDept.durationYears,
      electiveRules: { min: this.newDept.electiveMin, max: this.newDept.electiveMax }
    } as any).subscribe({
      next: () => {
        this.submitting = false;
        this.newDept = { name: '', durationYears: 4, electiveMin: 2, electiveMax: 3 };
        this.loadDepartments();
      },
      error: (err) => {
        this.submitting = false;
        this.error = err.error?.message || 'Failed to add department.';
      }
    });
  }
}
