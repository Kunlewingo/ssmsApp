import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private baseUrl = 'http://localhost:5000/api/students';

  constructor(private http: HttpClient) {}

  addStudent(student: any): Observable<any> {
    return this.http.post(this.baseUrl, student);
  }

  getStudents(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getStudentById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateStudent(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
