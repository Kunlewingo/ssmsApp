import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { DepartmentService } from '../../services/department.service';
import { Course, Department } from '../../models/course.model';

@Component({
  selector: 'app-view-course',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css']
})
export class ViewCourseComponent implements OnInit {

  courses: Course[] = [];
  departments: Department[] = [];

  selectedDepartmentId = '';
  selectedSemester: '' | 'first' | 'second' = '';

  levels = [100, 200, 300, 400, 500];

  // Inline edit state
  editingId: string | null = null;
  editForm: Partial<Course> & { department: string } = { department: '', courseCode: '', courseName: '', level: 100, type: 'compulsory', units: 1, semester: 'first' };
  saving = false;
  editError = '';

  constructor(
    private courseService: CourseService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.departmentService.getAll().subscribe(data => this.departments = data);
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe(data => this.courses = data);
  }

  selectSemester(sem: '' | 'first' | 'second'): void {
    this.selectedSemester = sem;
  }

  departmentIdOf(course: Course): string {
    const dept = course.department as any;
    return typeof dept === 'string' ? dept : dept?._id;
  }

  get filteredCourses(): Course[] {
    return this.courses.filter(c => {
      const matchesDept = !this.selectedDepartmentId || this.departmentIdOf(c) === this.selectedDepartmentId;
      const matchesSemester = !this.selectedSemester || c.semester === this.selectedSemester;
      return matchesDept && matchesSemester;
    });
  }

  startEdit(course: Course): void {
    this.editingId = course._id!;
    this.editError = '';
    this.editForm = {
      courseCode: course.courseCode,
      courseName: course.courseName,
      department: this.departmentIdOf(course),
      level: course.level,
      type: course.type,
      units: course.units,
      semester: course.semester
    };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editError = '';
  }

  saveEdit(course: Course): void {
    if (!this.editingId) return;
    this.saving = true;
    this.editError = '';

    this.courseService.updateCourse(this.editingId, this.editForm as Course).subscribe({
      next: (updated) => {
        const idx = this.courses.findIndex(c => c._id === this.editingId);
        if (idx > -1) this.courses[idx] = updated;
        this.saving = false;
        this.editingId = null;
      },
      error: (err) => {
        this.saving = false;
        this.editError = err.error?.message || 'Failed to update course. Please try again.';
      }
    });
  }
}