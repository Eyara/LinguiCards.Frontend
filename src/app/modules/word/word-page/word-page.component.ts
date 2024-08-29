import { Component, Input } from '@angular/core';
import { WordModel } from '../../../models/word.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'word-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './word-page.component.html',
  styleUrl: './word-page.component.scss'
})
export class WordPageComponent {
  words: WordModel[] = [];

  constructor() {
    this.words = this.getWords();
  }

  getWords(): WordModel[] {
    // this.words = this.wordService.getWords();

    return [
      { id: 1, name: 'Hello', translatedName: 'Привет', languageId: 1, learnedPercent: 25 },
      { id: 2, name: 'World', translatedName: 'Мир', languageId: 1 , learnedPercent: 60 },
    ];
  }

  deleteWord(word: WordModel) {
    this.words = this.words.filter(w => w.id !== word.id);
  }
}
