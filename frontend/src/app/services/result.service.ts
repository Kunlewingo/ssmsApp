import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private api = 'http://localhost:5000/api/results';

  constructor(private http: HttpClient) {}

  addResult(data: any) {
    return this.http.post(this.api, data);
  }

  getResults() {
    return this.http.get(this.api);
  }

  getResultByStudent(studentId: string) {
    return this.http.get(`${this.api}/student/${studentId}`);
  }
}