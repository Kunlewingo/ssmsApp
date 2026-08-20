import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacultyService } from '../../services/faculty.service';
import { Faculty } from '../../models/course.model';

@Component({
  selector: 'app-faculty-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculty-management.component.html',
  styleUrls: ['./faculty-management.component.css']
})
export class FacultyManagementComponent implements OnInit {

  faculties: Faculty[] = [];
  newFacultyName = '';
  submitting = false;
  error = '';

  constructor(private facultyService: FacultyService) {}

  ngOnInit(): void {
    this.loadFaculties();
  }

  loadFaculties(): void {
    this.facultyService.getFaculties().subscribe(data => this.faculties = data);
  }

  addFaculty(): void {
    if (!this.newFacultyName.trim()) return;

    this.submitting = true;
    this.error = '';

    this.facultyService.addFaculty({ name: this.newFacultyName.trim() }).subscribe({
      next: () => {
        this.submitting = false;
        this.newFacultyName = '';
        this.loadFaculties();
      },
      error: (err) => {
        this.submitting = false;
        this.error = err.error?.message || 'Failed to add faculty.';
      }
    });
  }
}
