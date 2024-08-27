import { Routes } from '@angular/router';
import { LanguagePageComponent } from './modules/language/language-page/language-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/language-page', pathMatch: 'full' },
  {
    path: 'language-page',
    loadComponent: () => import('./modules/language/language-page/language-page.component').then(m => m.LanguagePageComponent)
  }
];
