import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../interface/user';

interface LoginResponse {
  token: string;
  user: User; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userKey = 'user';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:8000/api/auth/login', { 
      email, 
      password 
    }).pipe(
      tap(response => {
        this.setSession(response)
        console.log('User logged in:', response);
      })
    );
  }

  register(name: string, lastname: string, username: string, email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:8000/api/auth/register', {
      name,
      lastname,
      username,
      email,
      password
    }).pipe(
      tap(response => {
        this.setSession(response)
        console.log('User registered:', response);

      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    console.log('Current user:', userStr);
    return userStr ? JSON.parse(userStr) : null;
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  updateCurrentUser(updatedUser: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    console.log('Current user updated:', updatedUser);
  }

  private setSession(authResult: LoginResponse): void {
    localStorage.setItem(this.tokenKey, authResult.token);
    localStorage.setItem(this.userKey, JSON.stringify(authResult.user));
    this.isLoggedInSubject.next(true);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
