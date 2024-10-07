import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TrainingType, WordModel, WordTrainingModel } from '../../../models/word.model';
import { CardComponent } from "../../../shared/card/card.component";
import { CommonModule } from '@angular/common';
import { forkJoin, map, mergeMap, Observable, of, startWith, take, tap, withLatestFrom, delay, shareReplay } from 'rxjs';
import { WordService } from '../../word/word.service';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'training-page',
  standalone: true,
  imports: [CommonModule, CardComponent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './training-page.component.html',
  styleUrls: ['./training-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingPageComponent {
  selectedOption$: Observable<string> = of('');
  trainingWords$: Observable<WordTrainingModel[]>;
  options: string[] = [];
  currentWord$: Observable<WordTrainingModel>;

  continueTraining$: Observable<[WordTrainingModel[], WordTrainingModel, boolean]> = of();

  languageId: number;
  isTrainingFinished: boolean = false;
  writtenTranslation: string = '';
  currentIndex: number = 0;

  constructor(private route: ActivatedRoute, private wordService: WordService) {
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
          this.wordService.updateLearnLevel(
            currentWord.id,
            this.getResult(currentWord, selectedOption),
            currentWord.type
          )
        ]);
      }),
      delay(300),
      tap(([words]) => {
        this.writtenTranslation = '';
        if (this.currentIndex === words.length - 1) {
          this.isTrainingFinished = true;
        } else {
          this.currentIndex++;
          this.selectedOption$ = of('');
          this.currentWord$ = of(words[this.currentIndex]);
          this.options = words[this.currentIndex].options;
        }
      })
    );
  }

  finishTraining() {
    this.isTrainingFinished = true;
  }

  getCardName(word: WordTrainingModel | null): string {
    if (!word) {
      return '';
    }
    return word.type === TrainingType.FromLearnLanguage || word.type === TrainingType.WritingFromLearnLanguage
      ? word.name
      : word.translatedName;
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
}
