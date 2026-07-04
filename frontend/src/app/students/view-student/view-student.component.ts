import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './view-student.component.html'
})
export class ViewStudentComponent implements OnInit {

  students: any[] = [];
  filteredStudents: any[] = [];
  searchQuery = '';

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.students = JSON.parse(localStorage.getItem('students') || '[]');
    this.applyFilter();
  }

  applyFilter(): void {

    const q = this.searchQuery.toLowerCase().trim();

    if (!q) {
      this.filteredStudents = [...this.students];
      return;
    }

    this.filteredStudents = this.students.filter(student =>
      student.name.toLowerCase().includes(q) ||
      student.email.toLowerCase().includes(q) ||
      student.course.toLowerCase().includes(q)
    );
  }

  saveStudent(student: any): void {

    student.editing = false;

    localStorage.setItem('students', JSON.stringify(this.students));

    alert('Student updated successfully.');

    this.loadStudents();
  }

  deleteStudent(index: number): void {

    const student = this.filteredStudents[index];

    const realIndex = this.students.indexOf(student);

    if (realIndex > -1) {

      this.students.splice(realIndex, 1);

      localStorage.setItem('students', JSON.stringify(this.students));

      this.loadStudents();

      alert('Student deleted successfully.');
    }
  }

}