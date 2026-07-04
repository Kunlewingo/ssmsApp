import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private api = 'http://localhost:5000/api/students';

  constructor(private http: HttpClient) {}

  addStudent(data: any) {
    return this.http.post(this.api, data);
  }

  getStudents() {
    return this.http.get(this.api);
  }

  getStudentById(id: string) {
    return this.http.get(`${this.api}/${id}`);
  }
}