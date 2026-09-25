import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/auth';

  register(user: any) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, user).pipe(
      tap((res) => this.setToken(res.token))
    );
  }

  login(credentials: any) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => this.setToken(res.token))
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
  
  private setToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
