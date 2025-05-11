import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslationPracticeService } from './translation-practice.service';
import { TranslationEvaluationResponse } from '../../models/translation-evaluation.model';
import { BehaviorSubject, Observable, of, switchMap, map, startWith, shareReplay } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-translation-practice',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './translation-practice.component.html',
  styleUrl: './translation-practice.component.scss'
})
export class TranslationPracticeComponent {
  length = 1;
  level = '';
  topic = '';
  userTranslation = '';

  private getTextTrigger$ = new BehaviorSubject<void>(undefined);
  private evaluateTrigger$ = new BehaviorSubject<void>(undefined);

  originalText$: Observable<string>;
  evaluationResult$: Observable<TranslationEvaluationResponse | null>;

  isLoadingText$ = new BehaviorSubject<boolean>(false);
  isLoadingEval$ = new BehaviorSubject<boolean>(false);

  languageLevels = [
    { value: 'A1', label: 'Начальный (A1)' },
    { value: 'A2', label: 'Элементарный (A2)' },
    { value: 'B1', label: 'Средний (B1)' },
    { value: 'B2', label: 'Выше среднего (B2)' },
    { value: 'C1', label: 'Продвинутый (C1)' },
    { value: 'C2', label: 'В совершенстве (C2)' }
  ];

  constructor(private translationService: TranslationPracticeService) {
    this.originalText$ = this.getTextTrigger$.pipe(
      switchMap(() => {
        if (!this.level) return of('');
        this.isLoadingText$.next(true);
        return this.translationService.getEvaluation(this.length, this.level, this.topic).pipe(
          map(text => {
            this.isLoadingText$.next(false);
            return text.trim();
          }),
          startWith('')
        );
      }),
      shareReplay(1)
    );

    this.evaluationResult$ = this.evaluateTrigger$.pipe(
      switchMap(() => {
        if (!this.userTranslation.trim() || !this.level) return of(null);
        this.isLoadingEval$.next(true);
        return this.originalText$.pipe(
          switchMap(originalText => {
            if (!originalText) {
              this.isLoadingEval$.next(false);
              return of(null);
            }
            return this.translationService.evaluateTranslation(
              this.level,
              originalText,
              this.userTranslation
            ).pipe(
              map(result => {
                this.isLoadingEval$.next(false);
                return result;
              })
            );
          }),
          startWith(null)
        );
      }),
      shareReplay(1)
    );
  }

  getText() {
    this.getTextTrigger$.next();
    this.userTranslation = '';
  }

  evaluateTranslation() {
    this.evaluateTrigger$.next();
  }
}
