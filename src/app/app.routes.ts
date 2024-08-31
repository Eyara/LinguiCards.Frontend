import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/language-page', pathMatch: 'full' },
  {
    path: 'language-page',
    loadComponent: () => import('./components/language/language-page/language-page.component').then(m => m.LanguagePageComponent)
  },
  {
    path: 'word-page/:id',
    loadComponent: () => import('./components/word/word-page/word-page.component').then(m => m.WordPageComponent)
  },
  {
    path: 'training-page/:languageId',
    loadComponent: () => import('./components/training/training-page/training-page.component').then(m => m.TrainingPageComponent)
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
