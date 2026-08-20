import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private baseUrl = 'http://localhost:5000/api/departments';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.baseUrl);
  }

  getByFaculty(facultyId: string): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/faculty/${facultyId}`);
  }

  getUnitCaps(): Observable<Record<number, number>> {
    return this.http.get<Record<number, number>>(`${this.baseUrl}/unit-caps`);
  }

  addDepartment(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.baseUrl, department);
  }
}
