import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { RegistrationService } from '../../services/registration.service';
import { GpaService } from '../../services/gpa.service';
import { toUserMessage } from '../../shared/error-message.util';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  student: any = null;
  registrations: any[] = [];
  sessionCGPA: number | null = null;
  cumulativeCGPA: number | null = null;
  loading = true;
  loadError = '';

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private registrationService: RegistrationService,
    private gpaService: GpaService
  ) {}

  ngOnInit(): void {
    const studentId = this.route.snapshot.paramMap.get('id');
    if (!studentId) return;

    this.studentService.getStudentById(studentId).subscribe({
      next: (student) => {
        this.student = student;

        this.registrationService.getAllRegistrations({ studentId }).subscribe({
          next: (regs) => this.registrations = regs,
          error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load registrations for this student.')
        });

        this.gpaService.getSessionCGPA(student.currentSession, studentId).subscribe({
          next: (res) => this.sessionCGPA = res.cgpa,
          error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load session CGPA.')
        });

        this.gpaService.getCumulativeCGPA(student.level, studentId).subscribe({
          next: (res) => {
            this.cumulativeCGPA = res.cgpa;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.loadError = toUserMessage(err, 'Couldn\'t load cumulative CGPA.');
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.loadError = toUserMessage(err, 'Couldn\'t load this student\'s profile.');
      }
    });
  }
}
