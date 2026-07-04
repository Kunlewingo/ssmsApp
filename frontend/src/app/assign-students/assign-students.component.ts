import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding:20px">

      <h2>Assign Students To Course</h2>

      <input
        type="text"
        placeholder="Student Name"
        [(ngModel)]="studentName"
      />

      <br><br>

      <input
        type="text"
        placeholder="Course Name"
        [(ngModel)]="courseName"
      />

      <br><br>

      <button (click)="assignStudent()">
        Assign Student
      </button>

    </div>
  `
})
export class AssignStudentsComponent {

  studentName = '';
  courseName = '';

  assignStudent() {

    alert(
      `${this.studentName} assigned to ${this.courseName}`
    );

    this.studentName = '';
    this.courseName = '';
  }
}