import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

const readEnv = (key: string, fallback: string): string => {
  const raw =
    (globalThis as any)?.process?.env?.[key] ??
    (typeof import.meta !== 'undefined' ? import.meta.env?.[key] : undefined);
  if (!raw) {
    return fallback;
  }
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

const apiBaseUrl = readEnv('NG_APP_API_BASE_URL', 'http://localhost:3000/api');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = readEnv('NG_APP_AUTH_BASE_URL', `${apiBaseUrl}/auth`);
  private tokenKey = readEnv('NG_APP_TOKEN_KEY', 'access_token');
  private userIdKey = readEnv('NG_APP_USER_ID_KEY', 'user_id');
  private refreshTokenKey = readEnv('NG_APP_REFRESH_TOKEN_KEY', 'refresh_token');
  private authStatus = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, userData);
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token is not available'));
    }
    return this.http.post(`${this.baseUrl}/refresh-token`, { refreshToken });
  }

  storeSession(token: string, userId?: string, refreshToken?: string) {
    localStorage.setItem(this.tokenKey, token);
    if (userId) {
      localStorage.setItem(this.userIdKey, userId);
    }
    if (refreshToken) {
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    this.authStatus.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.authStatus.next(false);
  }

  authChanges(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
