import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SelectedLanguageService } from '../selected-language.service';
import { Router } from '@angular/router';
import { tap, switchMap, shareReplay, catchError } from 'rxjs/operators';
import { LanguageModel, LanguageStatisticsModel } from '../../../models/language.model';
import { LanguageService } from '../language.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-language-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-overview.component.html',
  styleUrl: './language-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageOverviewComponent implements OnInit {
  private currentLanguage: LanguageModel | null = null;
  languageStats$: Observable<LanguageStatisticsModel> = new Observable<LanguageStatisticsModel>();

  constructor(
    private selectedLanguageService: SelectedLanguageService,
    private router: Router,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.languageStats$ = this.selectedLanguageService.getSelectedLanguageSubject$()
      .pipe(
        tap(language => {
          if (language && language.id) {
            this.currentLanguage = language;
            this.router.navigate(['/language-overview', language.id]);
          }
        }),
        switchMap(language => 
          this.languageService.getLanguageStatistics(language.id).pipe(
            catchError(error => {
              console.error('Error fetching language statistics:', error);
              return of({
                totalWords: 0,
                learnedWords: 0,
                accuracy: 0,
                activeLearnedPercent: 0,
                passiveLearnedPercent: 0,
                activeAverageLearnedPercent: 0,
                passiveAverageLearnedPercent: 0,
                activeAverageAccuracy: 0,
                passiveAverageAccuracy: 0,
                activeTrainingSize: 0,
                passiveTrainingSize: 0,
                totalTrainingDays: 0,
                wordOfTheDay: { name: '', translatedName: '' },
                bestActiveWordsByAccuracy: [],
                bestPassiveWordsByAccuracy: [],
                worstActiveWordsByAccuracy: [],
                worstPassiveWordsByAccuracy: []
              } as LanguageStatisticsModel);
            })
          )
        ),
        shareReplay(1)
      );
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
      this.router.navigate(['/grammar-page', this.currentLanguage.id]);
    }
  }
  navigateToTranslationPractice() {
    if (this.currentLanguage) {
      this.router.navigate(['/translation-practice', this.currentLanguage.id]);
    }
  }
  navigateToGrammarTask() {
    if (this.currentLanguage) {
      this.router.navigate(['/grammar-task', this.currentLanguage.id]);
    }
  }
}

