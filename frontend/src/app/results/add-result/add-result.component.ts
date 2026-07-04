import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-result',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './add-result.component.html',
  styleUrls: ['./add-result.component.css']
})
export class AddResultsComponent implements OnInit {

  students: any[] = [];

  selectedStudentId: number | null = null;

  result = {
    studentId: 0,
    studentName: '',
    faculty: '',
    course: '',
    score: 0,
    grade: ''
  };

  ngOnInit(): void {

    this.loadStudents();

  }

  loadStudents(): void {

    const storedStudents = localStorage.getItem('students');

    this.students = storedStudents
      ? JSON.parse(storedStudents)
      : [];

    console.log('Students Loaded:', this.students);

  }

  onStudentChange(): void {

    if (this.selectedStudentId === null) {

      this.result = {
        studentId: 0,
        studentName: '',
        faculty: '',
        course: '',
        score: 0,
        grade: ''
      };

      return;

    }

    const student = this.students.find(
      student => Number(student.id) === Number(this.selectedStudentId)
    );

    console.log('Selected Student:', student);

    if (student) {

      this.result.studentId = student.id;
      this.result.studentName = student.name;
      this.result.faculty = student.faculty || '';
      this.result.course = student.course || '';

    } else {

      this.result.studentId = 0;
      this.result.studentName = '';
      this.result.faculty = '';
      this.result.course = '';

    }

  }

  calculateGrade(): void {

    const score = Number(this.result.score);

    if (score >= 80) {

      this.result.grade = 'A';

    } else if (score >= 70) {

      this.result.grade = 'B';

    } else if (score >= 60) {

      this.result.grade = 'C';

    } else if (score >= 50) {

      this.result.grade = 'D';

    } else {

      this.result.grade = 'F';

    }

  }

  addResult(): void {

    if (
      !this.result.studentId ||
      this.result.score < 0 ||
      this.result.score > 100
    ) {

      alert('Please complete all required fields.');

      return;

    }

    this.calculateGrade();

    const results = JSON.parse(
      localStorage.getItem('results') || '[]'
    );

    results.push({

      ...this.result

    });

    localStorage.setItem(
      'results',
      JSON.stringify(results)
    );

    alert('Result Added Successfully.');

    this.resetForm();

  }

  resetForm(): void {

    this.selectedStudentId = null;

    this.result = {

      studentId: 0,
      studentName: '',
      faculty: '',
      course: '',
      score: 0,
      grade: ''

    };

  }

}