import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token?: string;
  accessToken?: string;
  user?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private readonly apiUrl = '/auth';

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap((response) => this.storeTokenFromResponse(response)));
  }

  register(email: string, password: string, displayName: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, { email, password, displayName })
      .pipe(tap((response) => this.storeTokenFromResponse(response)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  me(): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/me`);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private storeTokenFromResponse(response: AuthResponse): void {
    const token = response.token ?? response.accessToken;

    if (token) {
      localStorage.setItem(this.tokenKey, token);
    }
  }
}
