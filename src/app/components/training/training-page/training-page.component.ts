import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TrainingType, WordModel, WordTrainingModel } from '../../../models/word.model';
import { CardComponent } from "../../../shared/card/card.component";
import { CommonModule } from '@angular/common';
import { forkJoin, map, mergeMap, Observable, of, startWith, switchMap, take, tap, withLatestFrom, BehaviorSubject, filter, Subscription, delay, shareReplay } from 'rxjs';
import { WordService } from '../../word/word.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'training-page',
  standalone: true,
  imports: [CommonModule, CardComponent],
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
            currentWord.type === TrainingType.FromLearnLanguage ? currentWord.translatedName === selectedOption : currentWord.name === selectedOption)
        ]);
      }),
      delay(300),
      tap(([words, currentWord]) => {
        const currentIndex = words.findIndex((word: WordModel) => word.id === currentWord.id);
        const nextIndex = (currentIndex + 1) % words.length;

        if (nextIndex === 0) {
          this.isTrainingFinished = true;
        } else {
          this.selectedOption$ = of('');
          this.currentWord$ = of(words[nextIndex]);
          this.options = words[nextIndex].options;
        }
      })
    );
  }

  finishTraining() {
    this.isTrainingFinished = true;
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
