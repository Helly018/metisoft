import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login(email: string, password: string): Observable<{ token: string }> {
    if (email === 'hellygoswami1810@gmail.com' && password === 'Helly@001') {
      return of({ token: 'dummy-jwt-token-12345' }).pipe(delay(1500));
    }
    return throwError(() => new Error('Invalid email or password')).pipe(delay(1500));
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
