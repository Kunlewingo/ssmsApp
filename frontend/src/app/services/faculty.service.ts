import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Faculty } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class FacultyService {
  private baseUrl = 'http://localhost:5000/api/faculties';

  constructor(private http: HttpClient) {}

  getFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.baseUrl);
  }

  addFaculty(faculty: Partial<Faculty>): Observable<Faculty> {
    return this.http.post<Faculty>(this.baseUrl, faculty);
  }
}
