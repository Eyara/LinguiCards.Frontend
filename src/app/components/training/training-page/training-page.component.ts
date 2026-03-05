import { ChangeDetectionStrategy, Component, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TrainingType, WordConnection, WordTrainingModel } from '../../../models/word.model';
import { CommonModule } from '@angular/common';
import { forkJoin, map, mergeMap, Observable, of, startWith, take, tap, withLatestFrom, delay, shareReplay, BehaviorSubject, switchMap, catchError } from 'rxjs';
import { WordService } from '../../word/word.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TrainingModel, TrainingRenderType } from '../../../models/training.model';
import { TrainingService } from '../training.service';
import { TrainingConnectionComponent } from './training-connection/training-connection.component';
import { getTrainingRenderType, needShowOptions, getCardName, getTargetWord, checkAnswer, getOptionCssClass } from '../training-utils';

@Component({
  selector: 'training-page',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule,
    TrainingConnectionComponent],
  templateUrl: './training-page.component.html',
  styleUrls: ['./training-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingPageComponent implements AfterViewChecked {
  private destroyRef = inject(DestroyRef);

  selectedOption$: Observable<string> = of('');
  trainingWords$: Observable<WordTrainingModel[]>;
  options: string[] = [];
  currentWord$: Observable<WordTrainingModel>;
  trainingResult$: Observable<TrainingModel[]> = of();
  continueTraining$: Observable<[WordTrainingModel[], WordTrainingModel, boolean]> = of();

  languageId: number;
  isTrainingFinished = false;
  writtenTranslation = '';
  currentIndex = 0;

  connectionWords$ = new BehaviorSubject<string[]>([]);
  connectionTranslations$ = new BehaviorSubject<string[]>([]);
  expectedMatches$ = new BehaviorSubject<WordConnection[]>([]);
  handleLearnLevelUpdate$ = new Observable<boolean>();

  currentHintIndex = 0;
  revealedLetters = '';
  totalWords = 0;
  isLoading = false;
  challengedWordIds = new Set<number>();

  @ViewChild('translationInput') translationInput!: ElementRef<HTMLInputElement>;
  private shouldFocusInput = false;

  readonly getTrainingRenderType = getTrainingRenderType;
  readonly getCardName = getCardName;
  readonly getTargetWord = getTargetWord;

  constructor(
    private route: ActivatedRoute,
    private wordService: WordService,
    private trainingService: TrainingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.languageId = this.route.snapshot.params['languageId'];
    this.trainingWords$ = this.wordService.getUnlearnedWords(this.languageId).pipe(
      tap(words => this.totalWords = words.length),
      shareReplay(1)
    );
    this.currentWord$ = this.trainingWords$.pipe(
      take(1),
      map(words => words[0]),
      tap(word => this.options = word.options)
    );
  }

  get progressPercent(): number {
    return this.totalWords > 0 ? ((this.currentIndex + 1) / this.totalWords) * 100 : 0;
  }

  selectOption(option: string) {
    this.selectedOption$ = of(option);
    this.continueTraining();
  }

  continueTraining() {
    this.isLoading = true;
    this.continueTraining$ = this.trainingWords$.pipe(
      take(1),
      withLatestFrom(this.currentWord$),
      mergeMap(([words, currentWord]) => forkJoin([
        of(words),
        of(currentWord),
        this.selectedOption$
      ])),
      mergeMap(([words, currentWord, selectedOption]) => forkJoin([
        of(words),
        of(currentWord),
        currentWord.type !== TrainingType.WordConnect
          ? this.callUpdateLearnLevel(currentWord, selectedOption)
          : of(false)
      ])),
      delay(300),
      tap(([words]) => {
        if (this.currentIndex === words.length - 1) {
          this.isTrainingFinished = true;
          this.trainingResult$ = this.trainingService.getTrainingById(words[0].trainingId);
        } else {
          this.advanceToNextWord(words);
        }
        this.isLoading = false;
      })
    );
  }

  private advanceToNextWord(words: WordTrainingModel[]) {
    this.currentIndex++;
    this.selectedOption$ = of('');
    this.currentWord$ = of(words[this.currentIndex]);
    this.options = words[this.currentIndex].options;
    this.writtenTranslation = '';
    this.currentHintIndex = 0;
    this.revealedLetters = '';

    const renderType = getTrainingRenderType(words[this.currentIndex]);
    if (renderType === TrainingRenderType.Connection) {
      this.connectionWords$.next(words[this.currentIndex].connectionTargets);
      this.connectionTranslations$.next(words[this.currentIndex].options);
      this.expectedMatches$.next(words[this.currentIndex].connectionMatches);
    } else if (renderType === TrainingRenderType.Input) {
      this.shouldFocusInput = true;
      this.cdr.detectChanges();
    }
  }

  private callUpdateLearnLevel(currentWord: WordTrainingModel, selectedOption: string): Observable<boolean> {
    return this.wordService.updateLearnLevel(
      currentWord.id,
      checkAnswer(currentWord, selectedOption, this.writtenTranslation),
      currentWord.type,
      currentWord.trainingId,
      needShowOptions(currentWord) ? selectedOption : this.writtenTranslation,
      this.currentHintIndex
    );
  }

  handleWordConnectionMatch(word: WordConnection, translation: string) {
    this.handleLearnLevelUpdate$ = this.wordService.updateLearnLevel(
      word.id,
      word.translatedName === translation,
      TrainingType.WordConnect,
      word.trainingId,
      translation
    ).pipe(shareReplay(1));
  }

  finishTraining() {
    this.isLoading = true;
    this.isTrainingFinished = true;
    this.trainingResult$ = this.trainingWords$.pipe(
      take(1),
      map(words => words[0].trainingId),
      switchMap(trainingId => this.trainingService.getTrainingById(trainingId)),
      tap(() => this.isLoading = false)
    );
  }

  getBackgroundColor$(option: string): Observable<string> {
    return this.selectedOption$.pipe(
      startWith(''),
      withLatestFrom(this.currentWord$),
      map(([selectedOption, currentWord]) => getOptionCssClass(option, selectedOption, currentWord))
    );
  }

  startNewTraining() {
    this.isLoading = true;
    this.isTrainingFinished = false;
    this.currentIndex = 0;
    this.writtenTranslation = '';
    this.currentHintIndex = 0;
    this.revealedLetters = '';

    this.trainingWords$ = this.wordService.getUnlearnedWords(this.languageId).pipe(
      tap(words => { this.totalWords = words.length; this.isLoading = false; }),
      shareReplay(1)
    );

    this.currentWord$ = this.trainingWords$.pipe(
      take(1),
      map(words => words[0]),
      tap(word => this.options = word.options)
    );
  }

  goToDashboard() {
    this.router.navigate(['/language-overview', this.languageId]);
  }

  challengeWord(wordId: number, trainingId: string) {
    if (this.challengedWordIds.has(wordId)) return;

    this.isLoading = true;
    this.wordService.challengeWord(wordId, trainingId).pipe(
      tap(() => {
        this.challengedWordIds.add(wordId);
        this.isLoading = false;
        this.cdr.detectChanges();
      }),
      catchError((error) => {
        console.error('Error challenging word:', error);
        this.isLoading = false;
        return of(false);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  isWordChallenged(wordId: number): boolean {
    return this.challengedWordIds.has(wordId);
  }

  getCorrectCount(results: TrainingModel[]): number {
    return results.filter(r => r.isCorrectAnswer).length;
  }

  getHiddenLetters(word: WordTrainingModel | null): string {
    if (!word) return '';
    return '_'.repeat(getTargetWord(word).length - this.currentHintIndex);
  }

  isHintDisabled(word: WordTrainingModel | null): boolean {
    if (!word) return true;
    return this.currentHintIndex >= getTargetWord(word).length;
  }

  getHint() {
    this.currentWord$.pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(word => {
      if (word) {
        const target = getTargetWord(word);
        if (this.currentHintIndex < target.length) {
          this.revealedLetters = target.substring(0, this.currentHintIndex + 1);
          this.currentHintIndex++;
        }
      }
    });
  }

  ngAfterViewChecked() {
    if (this.shouldFocusInput && this.translationInput?.nativeElement) {
      requestAnimationFrame(() => {
        if (this.translationInput?.nativeElement) {
          this.translationInput.nativeElement.focus();
          this.shouldFocusInput = false;
        }
      });
    }
  }
}
