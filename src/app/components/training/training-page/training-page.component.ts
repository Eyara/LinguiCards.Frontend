import {ChangeDetectionStrategy, Component} from '@angular/core';
import {WordModel} from '../../../models/word.model';
import {CardComponent} from "../../../shared/card/card.component";
import {CommonModule} from '@angular/common';
import {forkJoin, map, mergeMap, Observable, of, switchMap, take, tap, withLatestFrom} from 'rxjs';
import {WordService} from '../../word/word.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'training-page',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './training-page.component.html',
  styleUrl: './training-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingPageComponent {
  currentWord$: Observable<WordModel>;
  trainingWords$: Observable<WordModel[]>;
  options$: Observable<string[]>;
  continueTraining$: Observable<[WordModel[], WordModel, boolean]> = of();

  selectedOption: string = '';
  languageId: number;
  isTrainingFinished: boolean = false;

  constructor(private route: ActivatedRoute, private wordService: WordService) {
    this.languageId = this.route.snapshot.params['languageId'];
    this.trainingWords$ = this.getWords();
    this.currentWord$ = this.trainingWords$.pipe(map(words => words[0]));
    this.options$ = this.getRandomOptions();
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
            const shuffled = allOptions.filter(option => option !== currentWord.translatedName)
              .sort(() => 0.5 - Math.random());
            const randomOptions = shuffled.slice(0, 3);
            randomOptions.push(currentWord.translatedName);
            return randomOptions.sort(() => 0.5 - Math.random());
          })
        );
      }),
      map(obs => obs)
    );
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  continueTraining() {
    this.continueTraining$ = this.trainingWords$.pipe(
      take(1),
      withLatestFrom(this.currentWord$),
      mergeMap(([words, currentWord]) => {
        return forkJoin([
          of(words),
          of(currentWord),
          this.wordService.updateLearnLevel(currentWord.id, currentWord.translatedName === this.selectedOption)
        ]);
      }),
      tap(([words, currentWord]) => {
        const currentIndex = words.findIndex((word: WordModel) => word.id === currentWord.id);
        const nextIndex = (currentIndex + 1) % words.length;

        if (nextIndex === 0) {
          this.isTrainingFinished = true;
        } else {
          this.currentWord$ = of(words[nextIndex]);
          this.selectedOption = '';
          this.options$ = this.getRandomOptions();
        }
      })
    );
  }
}
