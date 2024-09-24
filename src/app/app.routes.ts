import {Routes} from '@angular/router';
import {authGuard} from './guards/auth,guard';

export const routes: Routes = [
  {path: '', redirectTo: '/profile', pathMatch: 'full'},
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'language-page',
    loadComponent: () => import('./components/language/language-page/language-page.component').then(m => m.LanguagePageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'word-page/:id',
    loadComponent: () => import('./components/word/word-page/word-page.component').then(m => m.WordPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'training-page/:languageId',
    loadComponent: () => import('./components/training/training-page/training-page.component').then(m => m.TrainingPageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./components/login/sign-up/sign-up.component').then(m => m.SignUpComponent)
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./components/login/sign-in/sign-in.component').then(m => m.SignInComponent)
  }
];
