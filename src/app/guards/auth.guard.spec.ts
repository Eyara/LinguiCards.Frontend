import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { authGuard } from './auth.guard';
import { LoginService } from '../components/login/login.service';

describe('authGuard', () => {
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['isAuthenticated']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should allow access when authenticated', (done) => {
    loginServiceSpy.isAuthenticated.and.returnValue(of(true));

    TestBed.runInInjectionContext(() => {
      const result$ = authGuard();
      result$.subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });
  });

  it('should redirect to /sign-in when not authenticated', (done) => {
    const mockUrlTree = {} as UrlTree;
    loginServiceSpy.isAuthenticated.and.returnValue(of(false));
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    TestBed.runInInjectionContext(() => {
      const result$ = authGuard();
      result$.subscribe(result => {
        expect(result).toBe(mockUrlTree);
        expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/sign-in']);
        done();
      });
    });
  });
});
