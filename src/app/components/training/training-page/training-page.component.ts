import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WordModel } from '../../../models/word.model';
import { CardComponent } from "../../../shared/card/card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'training-page',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './training-page.component.html',
  styleUrl: './training-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrainingPageComponent {
  currentWord: WordModel;
  trainingWords: WordModel[] = [];
  options: string[] = [];
  selectedOption: string = '';
  isTrainingFinished: boolean = false;

  constructor() {
    this.trainingWords = this.getWords();
    this.currentWord = this.trainingWords[0];
    this.options = this.getRandomOptions();
  }

  getWords(): WordModel[] {
    return [
      { id: 1, name: 'Hello', translatedName: 'Привет', languageId: 1, learnedPercent: 25 },
      { id: 2, name: 'World', translatedName: 'Мир', languageId: 1, learnedPercent: 60 },
      { id: 3, name: 'Mom', translatedName: 'Мама', languageId: 1, learnedPercent: 25 },
      { id: 4, name: 'Dad', translatedName: 'Папа', languageId: 1, learnedPercent: 25 },
      { id: 5, name: 'Cat', translatedName: 'Кошка', languageId: 1, learnedPercent: 25 },
      { id: 6, name: 'Dog', translatedName: 'Собака', languageId: 1, learnedPercent: 25 }
    ];
  }

  getRandomOptions(): string[] {
    const allOptions = this.trainingWords.map(word => word.translatedName);
    const shuffled = allOptions.filter(option => option !== this.currentWord.translatedName)
      .sort(() => 0.5 - Math.random());
    const randomOptions = shuffled.slice(0, 3);
    randomOptions.push(this.currentWord.translatedName);
    return randomOptions.sort(() => 0.5 - Math.random());
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  continueTraining() {
    const currentIndex = this.trainingWords.indexOf(this.currentWord);
    const nextIndex = (currentIndex + 1) % this.trainingWords.length;

    if (nextIndex === 0) {
      this.isTrainingFinished = true;
    } else {
      this.currentWord = this.trainingWords[nextIndex];
      this.selectedOption = '';
      this.options = this.getRandomOptions();
    }
  }
}
