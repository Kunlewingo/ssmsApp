import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { ResultService } from '../../services/result.service';

@Component({
  selector: 'app-add-result',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.css']
})
export class AddResultsComponent implements OnInit {

  students: any[] = [];
  courses: any[] = [];

  selectedStudentId: string | null = null;
  selectedStudent: any = null;

  result = {
    student: '',
    course: '',
    session: '',
    level: null as number | null,
    semester: '' as 'first' | 'second' | '',
    score: 0,
    units: 0
  };

  gradePreview = '';

  constructor(
    private studentService: StudentService,
    private courseService: CourseService,
    private resultService: ResultService
  ) {}

  ngOnInit(): void {
    this.studentService.getStudents().subscribe(data => this.students = data);
  }

  onStudentChange(): void {
    this.selectedStudent = this.students.find(s => s._id === this.selectedStudentId) || null;
    this.courses = [];
    this.result.course = '';
    this.result.semester = '';

    if (this.selectedStudent) {
      this.result.student = this.selectedStudent._id;
      this.result.level = this.selectedStudent.level;
      this.result.session = this.selectedStudent.currentSession;
    }
  }

  onSemesterChange(): void {
    this.courses = [];
    this.result.course = '';
    if (!this.selectedStudent || !this.result.level || !this.result.semester) return;

    const departmentId = this.selectedStudent.department?._id || this.selectedStudent.department;
    this.courseService.getCoursesByDepartment(departmentId, this.result.level, this.result.semester)
      .subscribe(data => this.courses = data);
  }

  onCourseChange(): void {
    const course = this.courses.find(c => c._id === this.result.course);
    this.result.units = course?.units || 0;
  }

  calculateGradePreview(): void {
    const score = Number(this.result.score);
    if (score >= 70) this.gradePreview = 'A';
    else if (score >= 60) this.gradePreview = 'B';
    else if (score >= 50) this.gradePreview = 'C';
    else if (score >= 45) this.gradePreview = 'D';
    else if (score >= 40) this.gradePreview = 'E';
    else this.gradePreview = 'F';
  }

  addResult(): void {
    if (!this.result.student || !this.result.course || !this.result.semester ||
        this.result.score < 0 || this.result.score > 100) {
      alert('Please complete all required fields.');
      return;
    }

    this.resultService.addResult(this.result).subscribe({
      next: () => {
        alert('Result added successfully.');
        this.resetForm();
      },
      error: (err) => alert(err.error?.message || 'Failed to add result.')
    });
  }

  resetForm(): void {
    this.selectedStudentId = null;
    this.selectedStudent = null;
    this.courses = [];
    this.gradePreview = '';
    this.result = { student: '', course: '', session: '', level: null, semester: '', score: 0, units: 0 };
  }
}
