import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpaService } from '../../services/gpa.service';
import { AuthService } from '../../services/auth.service';
import { toUserMessage } from '../../shared/error-message.util';

@Component({
  selector: 'app-gpa-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gpa-summary.component.html',
  styleUrls: ['./gpa-summary.component.css']
})
export class GpaSummaryComponent implements OnInit {

  currentStudent: any = null;
  session = '';
  semester: 'first' | 'second' = 'first';

  semesterGPA: number | null = null;
  sessionCGPA: number | null = null;
  cumulativeCGPA: number | null = null;

  loading = false;
  loadError = '';

  constructor(private gpaService: GpaService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (student) => {
        this.currentStudent = student;
        this.session = student.currentSession;
        this.loadAll();
      },
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load your profile. Please log in again.')
    });
  }

  loadAll(): void {
    if (!this.session) return;
    this.loading = true;
    this.loadError = '';

    this.gpaService.getSemesterGPA(this.session, this.semester).subscribe({
      next: (res) => this.semesterGPA = res.gpa,
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load your semester GPA.')
    });

    this.gpaService.getSessionCGPA(this.session).subscribe({
      next: (res) => this.sessionCGPA = res.cgpa,
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load your session CGPA.')
    });

    this.gpaService.getCumulativeCGPA(this.currentStudent?.level).subscribe({
      next: (res) => {
        this.cumulativeCGPA = res.cgpa;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.loadError = toUserMessage(err, 'Couldn\'t load your cumulative CGPA.');
      }
    });
  }

  selectSemester(sem: 'first' | 'second'): void {
    this.semester = sem;
    this.loadAll();
  }
}
