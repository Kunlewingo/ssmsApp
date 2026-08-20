import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegistrationPayload {
  session: string;
  semester: 'first' | 'second';
  electiveCourseIds: string[];
}

export interface RegistrationResponse {
  registration: any;
  warning: string | null;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private baseUrl = 'http://localhost:5000/api/registration';

  constructor(private http: HttpClient) {}

  register(payload: RegistrationPayload): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.baseUrl, payload);
  }

  getRegistration(session: string, semester: string): Observable<any> {
    return this.http.get(this.baseUrl, { params: { session, semester } });
  }

  getAllRegistrations(filters: any = {}): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, { params: filters });
  }
}
