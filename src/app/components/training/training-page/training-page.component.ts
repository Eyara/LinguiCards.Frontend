import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TrainingType, WordConnection, WordTrainingModel } from '../../../models/word.model';
import { CardComponent } from "../../../shared/card/card.component";
import { CommonModule } from '@angular/common';
import { forkJoin, map, mergeMap, Observable, of, startWith, take, tap, withLatestFrom, delay, shareReplay, BehaviorSubject, switchMap } from 'rxjs';
import { WordService } from '../../word/word.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TrainingModel, TrainingRenderType } from '../../../models/training.model';
import { TrainingService } from '../training.service';
import { MatTableModule } from '@angular/material/table';
import { TrainingConnectionComponent } from './training-connection/training-connection.component';

@Component({
  selector: 'training-page',
  standalone: true,
  imports: [CommonModule, CardComponent, MatFormFieldModule, MatTableModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule,
    TrainingConnectionComponent],
  templateUrl: './training-page.component.html',
  styleUrls: ['./training-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingPageComponent {
  selectedOption$: Observable<string> = of('');
  trainingWords$: Observable<WordTrainingModel[]>;
  options: string[] = [];
  currentWord$: Observable<WordTrainingModel>;
  trainingResult$: Observable<TrainingModel[]> = of();

  continueTraining$: Observable<[WordTrainingModel[], WordTrainingModel, boolean]> = of();

  languageId: number;
  isTrainingFinished: boolean = false;
  writtenTranslation: string = '';
  currentIndex: number = 0;

  connectionWords$ = new BehaviorSubject<string[]>([]);
  connectionTranslations$ = new BehaviorSubject<string[]>([]);
  expectedMatches$ = new BehaviorSubject<WordConnection[]>([]);
  handleLearnLevelUpdate$ = new Observable<boolean>();

  matches: { [key: string]: string } = {};

  currentHintIndex: number = 0;
  revealedLetters: string = '';

  constructor(private route: ActivatedRoute, private wordService: WordService, private trainingService: TrainingService, private router: Router) {
    this.languageId = this.route.snapshot.params['languageId'];
    this.trainingWords$ = this.getWords().pipe(
      shareReplay(1)
    );
    this.currentWord$ = this.trainingWords$.pipe(
      take(1),
      map(words => words[0]),
      tap(word => this.options = word.options)
    );
  }

  getWords(): Observable<WordTrainingModel[]> {
    return this.wordService.getUnlearnedWords(this.languageId);
  }

  getTrainingRenderType(word: WordTrainingModel): TrainingRenderType {
    if (word?.type === TrainingType.WordConnect) {
      return TrainingRenderType.Connection;
    }
    else if (this.needShowOptions(word)) {
      return TrainingRenderType.Options;
    }
    return TrainingRenderType.Input;
  }

  getTrainingResult(trainingId: string): Observable<TrainingModel[]> {
    return this.trainingService.getTrainingById(trainingId);
  }

  selectOption(option: string) {
    this.selectedOption$ = of(option);
    this.continueTraining();
  }

  continueTraining() {
    this.continueTraining$ = this.trainingWords$.pipe(
      take(1),
      withLatestFrom(this.currentWord$),
      mergeMap(([words, currentWord]) => {
        return forkJoin([
          of(words),
          of(currentWord),
          this.selectedOption$
        ]);
      }),
      mergeMap(([words, currentWord, selectedOption]) => {
        return forkJoin([
          of(words),
          of(currentWord),
          currentWord.type !== TrainingType.WordConnect 
            ? this.callUpdateLearnLevel(currentWord, selectedOption)
            : of(false)
        ]);
      }),
      delay(300),
      tap(([words]) => {
        if (this.currentIndex === words.length - 1) {
          this.isTrainingFinished = true;
          this.trainingResult$ = this.getTrainingResult(words[0].trainingId);
        } else {
          this.currentIndex++;
          this.selectedOption$ = of('');
          this.currentWord$ = of(words[this.currentIndex]);
          this.options = words[this.currentIndex].options;
          this.writtenTranslation = '';
          this.currentHintIndex = 0;
          this.revealedLetters = '';
          if (this.getTrainingRenderType(words[this.currentIndex]) === TrainingRenderType.Connection) {
            this.connectionWords$.next(words[this.currentIndex].connectionTargets);
            this.connectionTranslations$.next(words[this.currentIndex].options);
            this.expectedMatches$.next(words[this.currentIndex].connectionMatches);
          }
        }
      })
    );
  }

  callUpdateLearnLevel(currentWord: WordTrainingModel, selectedOption: string): Observable<boolean> {
    return this.wordService.updateLearnLevel(
      currentWord.id,
      this.getResult(currentWord, selectedOption),
      currentWord.type,
      currentWord.trainingId,
      this.needShowOptions(currentWord) ? selectedOption : this.writtenTranslation,
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
    ).pipe(
      tap(() => {}),
      shareReplay(1)
    );
  }

  finishTraining() {
    this.isTrainingFinished = true;
    this.trainingResult$ = this.trainingWords$.pipe(
      take(1),
      map(words => words[0].trainingId),
      switchMap(trainingId => this.getTrainingResult(trainingId))
    );
  }

  getCardName(word: WordTrainingModel | null): string {
    if (!word) {
      return '';
    }
    return word.type === TrainingType.FromLearnLanguage || word.type === TrainingType.WritingFromLearnLanguage
      ? word.name
      : word.translatedName;
  }

  getTargetWord(word: WordTrainingModel | null): string {
    if (!word) {
      return '';
    }
    return word.type === TrainingType.FromLearnLanguage || word.type === TrainingType.WritingFromLearnLanguage
      ? word.translatedName
      : word.name;
  }

  needShowOptions(word: WordTrainingModel | null): boolean {
    return word?.type === TrainingType.FromLearnLanguage || word?.type === TrainingType.FromNativeLanguage;
  }

  getResult(word: WordTrainingModel | null, selectedOption: string): boolean {
    if (!word) {
      return false;
    }
    let result = false;

    if (word.type === TrainingType.FromLearnLanguage) {
      result = word.translatedName === selectedOption;
    }
    else if (word.type === TrainingType.FromNativeLanguage) {
      result = word.name === selectedOption;
    }
    else if (word.type === TrainingType.WritingFromLearnLanguage) {
      result = word.translatedName.toLowerCase().trim() === this.writtenTranslation.toLowerCase().trim();
    }
    else if (word.type === TrainingType.WritingFromNativeLanguage) {
      result = word.name.toLowerCase().trim() === this.writtenTranslation.toLowerCase().trim();
    }

    return result;
  }

  getBackgroundColor$(option: string): Observable<string> {
    return this.selectedOption$.pipe(
      startWith(''),
      withLatestFrom(this.currentWord$),
      map(([selectedOption, currentWord]) => {
        if (currentWord && currentWord.translatedName) {
          if (selectedOption === option) {
            const isCorrect = (currentWord.type === TrainingType.FromLearnLanguage && currentWord.translatedName === selectedOption) ||
              (currentWord.type !== TrainingType.FromLearnLanguage && currentWord.name === selectedOption);
            return isCorrect ? 'background-green' : 'background-red';
          }
        }
        return '';
      })
    );
  }

  startNewTraining() {
    this.isTrainingFinished = false;
    this.currentIndex = 0;
    this.writtenTranslation = '';
    this.currentHintIndex = 0;
    this.revealedLetters = '';

    this.trainingWords$ = this.getWords().pipe(
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

  getHiddenLetters(word: WordTrainingModel | null): string {
    if (!word) return '';
    const targetWord = this.getTargetWord(word);
    return '_'.repeat(targetWord.length - this.currentHintIndex);
  }

  isHintDisabled(word: WordTrainingModel | null): boolean {
    if (!word) return true;
    const targetWord = this.getTargetWord(word);
    return this.currentHintIndex >= targetWord.length;
  }

  getHint() {
    this.currentWord$.pipe(
      take(1)
    ).subscribe(word => {
      if (word) {
        const targetWord = this.getTargetWord(word);
        if (this.currentHintIndex < targetWord.length) {
          this.revealedLetters = targetWord.substring(0, this.currentHintIndex + 1);
          this.currentHintIndex++;
        }
      }
    });
  }
}
