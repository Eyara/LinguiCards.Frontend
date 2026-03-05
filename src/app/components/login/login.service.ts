import {Injectable, signal, computed, inject} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {API_BASE_URL} from '../../shared/api.token';

interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = inject(API_BASE_URL);
  private authStatus = signal<boolean>(this.hasToken());
  public isLoggedIn = computed(() => this.authStatus());
  public authStatus$ = toObservable(this.authStatus);

  constructor(private http: HttpClient) {
  }

  signIn(user: User): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/User/login`, user, {
      responseType: 'text',
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).pipe(
      tap(token => this.setToken(token)),
      map(() => true)
    );
  }

  signUp(user: User): Observable<boolean> {
    return this.http.post(`${this.apiUrl}/User/register`, user, {
      responseType: 'text',
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }).pipe(
      tap(token => this.setToken(token)),
      map(() => true)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authStatus.set(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus$;
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.authStatus.set(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}
