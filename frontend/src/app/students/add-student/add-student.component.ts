import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {

  student = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    faculty: '',
    course: '',
    dateRegistered: ''
  };

  faculties: { [key: string]: string[] } = {

    Engineering: [
      'Computer Engineering',
      'Civil Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Chemical Engineering'
    ],

    Science: [
      'Computer Science',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biochemistry',
      'Microbiology'
    ],

    'Management Sciences': [
      'Accounting',
      'Business Administration',
      'Marketing',
      'Banking and Finance',
      'Insurance'
    ],

    'Social Sciences': [
      'Economics',
      'Political Science',
      'Psychology',
      'Sociology',
      'Mass Communication'
    ],

    Arts: [
      'English',
      'History',
      'Linguistics',
      'Theatre Arts'
    ],

    Education: [
      'Education Biology',
      'Education Chemistry',
      'Education Mathematics',
      'Guidance and Counselling'
    ],

    Law: [
      'Law'
    ],

    Medicine: [
      'Medicine and Surgery',
      'Nursing',
      'Pharmacy',
      'Medical Laboratory Science'
    ]

  };

  courses: string[] = [];

  constructor(private router: Router) {}

  getFacultyNames(): string[] {
    return Object.keys(this.faculties);
  }

  onFacultyChange(): void {

    this.courses =
      this.faculties[this.student.faculty] || [];

    this.student.course = '';

  }

  lettersOnly(event: any): void {

    const value =
      event.target.value.replace(/[^a-zA-Z ]/g, '');

    event.target.value = value;

    this.student.name = value;

  }

  numbersOnly(event: any): void {

    const value =
      event.target.value.replace(/[^0-9]/g, '');

    event.target.value = value;

    this.student.phone = value;

  }

  validateEmail(email: string): boolean {

    const pattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

  }

  addStudent(): void {

    if (
      !this.student.name.trim() ||
      !this.student.email.trim() ||
      !this.student.phone.trim() ||
      !this.student.faculty ||
      !this.student.course ||
      !this.student.dateRegistered
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

    let students = JSON.parse(
      localStorage.getItem('students') || '[]'
    );

    this.student.id = Date.now();

    students.push({

      ...this.student

    });

    localStorage.setItem(

      'students',

      JSON.stringify(students)

    );

    alert('Student added successfully.');

    this.resetForm();

    this.router.navigate(['/view-student']);

  }

  resetForm(): void {

    this.student = {

      id: 0,

      name: '',

      email: '',

      phone: '',

      faculty: '',

      course: '',

      dateRegistered: ''

    };

    this.courses = [];

  }

}