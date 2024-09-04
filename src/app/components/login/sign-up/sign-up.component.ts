import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardActions, MatCardModule} from '@angular/material/card';
import {MatError, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {Router} from '@angular/router';
import {LoginService} from '../login.service';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatError,
    MatCardActions
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss', '../shared/login.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUpComponent {

  signUpForm: FormGroup;
  signUpResult$: Observable<boolean | null> = of(null);

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {validator: this.passwordMatchValidator});
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      this.signUpResult$ = this.loginService.signUp(this.signUpForm.value).pipe(
        tap(success => {
          if (success) {
            this.router.navigate(['/sign-in']);
          }
        }),
        catchError(error => {
          console.error('Sign-up failed:', error);
          return of(false);
        })
      );
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : {passwordMismatch: true};
  }

}
