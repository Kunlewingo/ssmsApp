import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GpaService {
  private baseUrl = 'http://localhost:5000/api/gpa';

  constructor(private http: HttpClient) {}

  getSemesterGPA(session: string, semester: string, studentId?: string): Observable<any> {
    const params: any = { session, semester };
    if (studentId) params.studentId = studentId;
    return this.http.get(`${this.baseUrl}/semester`, { params });
  }

  getSessionCGPA(session: string, studentId?: string): Observable<any> {
    const params: any = { session };
    if (studentId) params.studentId = studentId;
    return this.http.get(`${this.baseUrl}/session`, { params });
  }

  getCumulativeCGPA(uptoLevel?: number, studentId?: string): Observable<any> {
    const params: any = {};
    if (uptoLevel) params.uptoLevel = uptoLevel;
    if (studentId) params.studentId = studentId;
    return this.http.get(`${this.baseUrl}/cumulative`, { params });
  }
}
