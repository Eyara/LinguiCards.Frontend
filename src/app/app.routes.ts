import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/language-page', pathMatch: 'full' },
  {
    path: 'language-page',
    loadComponent: () => import('./modules/language/language-page/language-page.component').then(m => m.LanguagePageComponent)
  },
  {
    path: 'word-page/:id',
    loadComponent: () => import('./modules/word/word-page/word-page.component').then(m => m.WordPageComponent)
  },
  {
    path: 'training-page/:languageId',
    loadComponent: () => import('./modules/training/training-page/training-page.component').then(m => m.TrainingPageComponent)
  }
];
