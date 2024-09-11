import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WordModel } from '../../../models/word.model';
import { CardComponent } from "../../../shared/card/card.component";
import { CommonModule } from '@angular/common';
import { forkJoin, map, mergeMap, Observable, of, startWith, switchMap, take, tap, withLatestFrom, BehaviorSubject, filter, Subscription, delay } from 'rxjs';
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
  options$: Observable<string[]>;
  selectedOption$: Observable<string> = of('');

  trainingWords$: Observable<WordModel[]>;
  private currentWordSubject = new BehaviorSubject<WordModel | null>(null);
  currentWord$: Observable<WordModel> = this.currentWordSubject.asObservable().pipe(filter(word => word !== null));
  trainingWordsSubscription$: Subscription = Subscription.EMPTY;

  continueTraining$: Observable<[WordModel[], WordModel, boolean]> = of();

  languageId: number;
  isTrainingFinished: boolean = false;

  constructor(private route: ActivatedRoute, private wordService: WordService) {
    this.languageId = this.route.snapshot.params['languageId'];
    this.trainingWords$ = this.getWords();

    this.trainingWordsSubscription$ = this.trainingWords$.pipe(
      take(1),
      tap(words => {
        if (words.length > 0) {
          this.currentWordSubject.next(words[0]);
        }
      }),
      map(() => true)
    ).subscribe();

    this.options$ = this.getRandomOptions();
  }

  ngOnDestroy(): void {
    this.trainingWordsSubscription$.unsubscribe();
  }

  getWords(): Observable<WordModel[]> {
    return this.wordService.getUnlearnedWords(this.languageId);
  }

  getRandomOptions(): Observable<string[]> {
    return this.currentWord$.pipe(
      switchMap(currentWord => {
        return this.trainingWords$.pipe(
          map(words => {
            const allOptions = words.map(word => word.translatedName);
            const shuffled = allOptions.filter(option => option !== currentWord?.translatedName)
              .sort(() => 0.5 - Math.random());
            const randomOptions = shuffled.slice(0, 3);
            randomOptions.push(currentWord?.translatedName);
            return randomOptions.sort(() => 0.5 - Math.random());
          })
        );
      }),
      map(obs => obs)
    );
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
          this.wordService.updateLearnLevel(currentWord.id, currentWord.translatedName === selectedOption)
        ]);
      }),
      delay(300),
      tap(([words, currentWord]) => {
        const currentIndex = words.findIndex((word: WordModel) => word.id === currentWord.id);
        const nextIndex = (currentIndex + 1) % words.length;

        if (nextIndex === 0) {
          this.isTrainingFinished = true;
        } else {
          this.currentWordSubject.next(words[nextIndex]);
          this.selectedOption$ = of('');
          this.options$ = this.getRandomOptions();
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
            return currentWord.translatedName === selectedOption ? 'background-green' : 'background-red';
          }
        }
        return '';
      })
    );
  }
}
