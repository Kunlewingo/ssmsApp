import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => { if (res?.token) localStorage.setItem('token', res.token); })
    );
  }

  loginStudent(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/student-login`, data).pipe(
      tap((res: any) => { if (res?.token) localStorage.setItem('token', res.token); })
    );
  }

  getMe(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  changePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Decode role straight from the JWT payload — used by roleGuard without
  // needing a network round trip on every navigation.
  getRole(): 'admin' | 'student' | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
