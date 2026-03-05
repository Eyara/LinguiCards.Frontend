import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start as unauthenticated when no token exists', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should sign in and store token', (done) => {
    service.signIn({ username: 'testuser', password: 'password123' }).subscribe(result => {
      expect(result).toBeTrue();
      expect(localStorage.getItem('token')).toBe('fake-jwt-token');
      expect(service.isLoggedIn()).toBeTrue();
      done();
    });

    const req = httpMock.expectOne('/api/User/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'testuser', password: 'password123' });
    req.flush('fake-jwt-token');
  });

  it('should sign up and store token', (done) => {
    service.signUp({ username: 'newuser', password: 'password123' }).subscribe(result => {
      expect(result).toBeTrue();
      expect(localStorage.getItem('token')).toBe('signup-token');
      expect(service.isLoggedIn()).toBeTrue();
      done();
    });

    const req = httpMock.expectOne('/api/User/register');
    expect(req.request.method).toBe('POST');
    req.flush('signup-token');
  });

  it('should clear token and update auth status on logout', () => {
    localStorage.setItem('token', 'existing-token');
    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should emit auth status changes via authStatus$', (done) => {
    const statuses: boolean[] = [];

    service.authStatus$.subscribe(status => {
      statuses.push(status);
      if (statuses.length === 2) {
        expect(statuses).toEqual([false, true]);
        done();
      }
    });

    service.signIn({ username: 'user', password: 'pass' }).subscribe();
    httpMock.expectOne('/api/User/login').flush('token');
  });
});
