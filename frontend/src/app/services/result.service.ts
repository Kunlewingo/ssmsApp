import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResultService {
  private baseUrl = 'http://localhost:5000/api/results';

  constructor(private http: HttpClient) {}

  addResult(payload: any): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  getResults(params: any = {}): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { params });
  }

  deleteResult(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
