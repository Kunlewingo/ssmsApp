import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../services/registration.service';
import { GpaService } from '../../services/gpa.service';
import { toUserMessage } from '../../shared/error-message.util';

@Component({
  selector: 'app-registrations-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registrations-overview.component.html',
  styleUrls: ['./registrations-overview.component.css']
})
export class RegistrationsOverviewComponent implements OnInit {
  registrations: any[] = [];
  gpaByStudent: Record<string, number> = {};
  loadError = '';

  constructor(
    private registrationService: RegistrationService,
    private gpaService: GpaService
  ) {}

  ngOnInit() {
    this.registrationService.getAllRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;
        // Fetch session CGPA per unique student shown, so admins see it alongside registration data
        const uniqueStudentIds = [...new Set(data.map(r => r.student?._id).filter(Boolean))];
        uniqueStudentIds.forEach(studentId => {
          const reg = data.find(r => r.student?._id === studentId);
          if (reg) {
            this.gpaService.getSessionCGPA(reg.session, studentId).subscribe({
              next: (res) => this.gpaByStudent[studentId] = res.cgpa,
              error: () => { /* CGPA is a nice-to-have here; skip silently per-student rather than blocking the page */ }
            });
          }
        });
      },
      error: (err) => this.loadError = toUserMessage(err, 'Couldn\'t load registrations. Please refresh.')
    });
  }
}
