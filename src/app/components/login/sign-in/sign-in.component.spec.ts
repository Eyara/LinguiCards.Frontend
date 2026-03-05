import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['signIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SignInComponent, NoopAnimationsModule],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.signInForm.valid).toBeFalse();
  });

  it('should be valid when username and password are filled', () => {
    component.signInForm.setValue({ username: 'testuser', password: 'password123' });
    expect(component.signInForm.valid).toBeTrue();
  });

  it('should require username', () => {
    const usernameControl = component.signInForm.get('username');
    usernameControl?.setValue('');
    expect(usernameControl?.hasError('required')).toBeTrue();
  });

  it('should require password', () => {
    const passwordControl = component.signInForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTrue();
  });

  it('should not call loginService when form is invalid', () => {
    component.onSubmit();
    expect(loginServiceSpy.signIn).not.toHaveBeenCalled();
  });

  it('should navigate to language-page on successful sign-in', () => {
    loginServiceSpy.signIn.and.returnValue(of(true));
    component.signInForm.setValue({ username: 'user', password: 'pass' });
    component.onSubmit();

    component.signInResult$.subscribe();
    expect(loginServiceSpy.signIn).toHaveBeenCalledWith({ username: 'user', password: 'pass' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/language-page']);
  });

  it('should handle sign-in failure gracefully', () => {
    loginServiceSpy.signIn.and.returnValue(throwError(() => new Error('Auth failed')));
    component.signInForm.setValue({ username: 'user', password: 'wrong' });
    component.onSubmit();

    component.signInResult$.subscribe(result => {
      expect(result).toBeFalse();
    });
  });
});
