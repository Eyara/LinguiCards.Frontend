import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = '/api';
  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  public authStatus$ = this.authStatusSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  signIn(user: User): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/user/login`, user, {
      responseType: 'text',
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).pipe(
      tap(token => this.setToken(token)),
      map(() => true)
    );
  }

  signUp(user: User): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/user/register`, user, {
      responseType: 'text',
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).pipe(
      tap(token => this.setToken(token)),
      map(() => true)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authStatusSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus$;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.authStatusSubject.next(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
