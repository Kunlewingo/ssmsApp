import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FacultyService } from '../../services/faculty.service';
import { DepartmentService } from '../../services/department.service';
import { StudentService } from '../../services/student.service';
import { Faculty, Department } from '../../models/course.model';
import { toUserMessage } from '../../shared/error-message.util';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  student = {
    name: '',
    email: '',
    phone: '',
    faculty: '',       // used locally to filter departments only; not sent to backend
    department: '',
    level: null as number | null,
    currentSession: '',
    dateRegistered: ''
  };

  faculties: Faculty[] = [];
  departments: Department[] = [];
  loadError = '';

  // Shown once, right after a student is created, so the admin can hand it over.
  generatedPassword = '';
  createdStudentName = '';
  copyConfirmation = false;

  constructor(
    private router: Router,
    private facultyService: FacultyService,
    private departmentService: DepartmentService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.facultyService.getFaculties().subscribe({
      next: (data) => this.faculties = data,
      error: (err) => this.loadError = toUserMessage(err, 'Could not load faculties. Please refresh.')
    });
    this.student.dateRegistered = new Date().toISOString().split('T')[0];
    this.student.currentSession = this.getDefaultSession();
  }

  getDefaultSession(): string {
    const now = new Date();
    const year = now.getFullYear();
    const startYear = now.getMonth() >= 8 ? year : year - 1;
    return `${startYear}/${startYear + 1}`;
  }

  onFacultyChange(): void {
    this.departments = [];
    this.student.department = '';
    this.student.level = null;
    if (this.student.faculty) {
      this.departmentService.getByFaculty(this.student.faculty).subscribe({
        next: (data) => this.departments = data,
        error: (err) => this.loadError = toUserMessage(err, 'Could not load departments. Please refresh.')
      });
    }
  }

  get availableLevels(): number[] {
    const selectedDept = this.departments.find(d => d._id === this.student.department);
    const base = [100, 200, 300, 400];
    if (selectedDept?.durationYears === 5) base.push(500);
    return base;
  }

  selectLevel(lvl: number): void {
    this.student.level = lvl;
  }

  lettersOnly(event: any): void {
    const value = event.target.value.replace(/[^a-zA-Z ]/g, '');
    event.target.value = value;
    this.student.name = value;
  }

  numbersOnly(event: any): void {
    const value = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = value;
    this.student.phone = value;
  }

  validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  addStudent(): void {
    if (
      !this.student.name.trim() ||
      !this.student.email.trim() ||
      !this.student.phone.trim() ||
      !this.student.faculty ||
      !this.student.department ||
      !this.student.level ||
      !this.student.currentSession
    ) {
      alert('Please complete all required fields.');
      return;
    }

    if (!this.validateEmail(this.student.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (this.student.phone.length !== 11) {
      alert('Phone number must contain exactly 11 digits.');
      return;
    }

    // faculty was only used locally to filter departments — don't send it
    const { faculty, ...payload } = this.student;

    this.studentService.addStudent(payload).subscribe({
      next: (res) => {
        this.createdStudentName = res.name;
        this.generatedPassword = res.temporaryPassword;
        this.copyConfirmation = false;
        this.resetForm();
      },
      error: (err) => {
        alert(toUserMessage(err, 'Failed to add student.'));
      }
    });
  }

  copyGeneratedPassword(): void {
    navigator.clipboard.writeText(this.generatedPassword).then(() => {
      this.copyConfirmation = true;
      setTimeout(() => this.copyConfirmation = false, 2000);
    });
  }

  dismissGeneratedPassword(): void {
    this.generatedPassword = '';
    this.createdStudentName = '';
    this.router.navigate(['/view-student']);
  }

  resetForm(): void {
    this.student = {
      name: '', email: '', phone: '',
      faculty: '', department: '', level: null,
      currentSession: this.getDefaultSession(),
      dateRegistered: new Date().toISOString().split('T')[0]
    };
    this.departments = [];
  }
}
