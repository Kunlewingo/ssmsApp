import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { toUserMessage } from '../../shared/error-message.util';

@Component({
  selector: 'app-view-student',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  students: any[] = [];
  searchTerm = '';
  loadError = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => this.students = data,
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load students. Please refresh.')
    });
  }

  get filteredStudents(): any[] {
    if (!this.searchTerm.trim()) return this.students;
    const term = this.searchTerm.toLowerCase();
    return this.students.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.department?.name?.toLowerCase().includes(term)
    );
  }

  deleteStudent(id: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (!confirm('Delete this student?')) return;
    this.studentService.deleteStudent(id).subscribe({
      next: () => this.loadStudents(),
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t delete this student. Please try again.')
    });
  }

  initials(name: string): string {
    return name?.charAt(0)?.toUpperCase() || '?';
  }
}
