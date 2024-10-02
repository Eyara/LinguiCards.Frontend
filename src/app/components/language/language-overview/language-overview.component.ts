import { Component } from '@angular/core';
import { SelectedLanguageService } from '../selected-language.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageModel } from '../../../models/language.model';

@Component({
  selector: 'app-language-overview',
  standalone: true,
  imports: [],
  templateUrl: './language-overview.component.html',
  styleUrl: './language-overview.component.scss'
})
export class LanguageOverviewComponent {
  private currentLanguage: LanguageModel | null = null;

  constructor(private selectedLanguageService: SelectedLanguageService, private router: Router) {
    this.selectedLanguageService.getSelectedLanguageSubject$()
      .pipe(
        tap(language => {
          this.router.navigate(['/language-overview', language.id]);
          this.currentLanguage = language;
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  navigateToTraining() {
    if (this.currentLanguage) {
      this.router.navigate(['/training-page', this.currentLanguage.id]);
    }
  }
  navigateToWordPage() {
    if (this.currentLanguage) {
      this.router.navigate(['/word-page', this.currentLanguage.id]);
    }
  }
  navigateToGrammar() {
    if (this.currentLanguage) {
      this.router.navigate(['/grammar', this.currentLanguage.id]);
    }
  }
}

