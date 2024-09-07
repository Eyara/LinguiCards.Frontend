import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {LoginService} from '../login.service';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {MatButtonModule} from '@angular/material/button';
import {MatError, MatFormFieldModule} from '@angular/material/form-field';
import {MatCardActions, MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatError,
    MatCardActions,
    RouterModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss', '../shared/login.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  signInForm: FormGroup;
  signInResult$: Observable<boolean | null> = of(null);

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) {
    this.signInForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signInForm.valid) {
      this.signInResult$ = this.loginService.signIn(this.signInForm.value).pipe(
        tap(success => {
          if (success) {
            this.router.navigate(['/language-page']);
          }
        }),
        catchError(error => {
          console.error('Sign-in failed:', error);
          return of(false);
        })
      );
    }
  }
}
