import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { WordConnection } from '../../../../models/word.model';

@Component({
  selector: 'training-connection',
  templateUrl: './training-connection.component.html',
  styleUrls: ['./training-connection.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class TrainingConnectionComponent {
  @Input() connectionWords: string[] = [];
  @Input() connectionTranslations: string[] = [];
  @Input() expectedMatches: WordConnection[] = [];
  @Output() matchesComplete = new EventEmitter<{ [key: string]: string }>();
  @Output() updateLearnLevel = new EventEmitter<{ word: WordConnection, translation: string, isCorrect: boolean }>();

  selectedWordConnection: WordConnection | null = null;
  selectedTranslationConnection: string | null = null;
  matches: { [key: string]: string } = {};

  get matchedCount(): number {
    return this.expectedMatches.filter(m => this.isWordMatched(m.name) && this.isCorrectWordMatch(m.name)).length;
  }

  selectWord(value: string, type: 'word' | 'translation'): void {
    if (type === 'word') {
      const wordConnection = this.expectedMatches.find(w => w.name === value);
      this.selectedWordConnection = wordConnection || null;
      if (this.selectedTranslationConnection) {
        this.matches[value] = this.selectedTranslationConnection;

        if (!this.isCorrectWordMatch(value)) {
          setTimeout(() => {
            delete this.matches[value];
            this.selectedWordConnection = null;
            this.selectedTranslationConnection = null;
          }, 500);
        } else {
          this.selectedWordConnection = null;
          this.selectedTranslationConnection = null;
          this.checkAndEmitCompletion();
        }
      }
    } else {
      this.selectedTranslationConnection = value;
      if (this.selectedWordConnection) {
        this.matches[this.selectedWordConnection.name] = value;
        
        const isCorrect = this.isCorrectWordMatch(this.selectedWordConnection!.name);
        this.updateLearnLevel.emit({
          word: this.selectedWordConnection,
          translation: value,
          isCorrect
        });

        if (!isCorrect) {
          setTimeout(() => {
            delete this.matches[this.selectedWordConnection!.name];
            this.selectedWordConnection = null;
            this.selectedTranslationConnection = null;
          }, 500);
        } else {
          this.selectedWordConnection = null;
          this.selectedTranslationConnection = null;
          this.checkAndEmitCompletion();
        }
      }
    }
  }

  private checkAndEmitCompletion(): void {
    const allWordsMatched = this.expectedMatches.every(
      match => this.isCorrectWordMatch(match.name) && this.isWordMatched(match.name)
    );
    
    if (allWordsMatched) {
      this.resetState();
      this.matchesComplete.emit(this.matches);
    }
  }

  isWordMatched(word: string): boolean {
    return word in this.matches;
  }

  isTranslationMatched(translation: string): boolean {
    return Object.values(this.matches).includes(translation);
  }

  isCorrectWordMatch(word: string): boolean {
    return this.expectedMatches.find(match => match.name === word)?.translatedName === this.matches[word];
  }

  isCorrectTranslationMatch(translation: string): boolean {
    const matchedWord = Object.keys(this.matches).find(key => this.matches[key] === translation);
    return this.isTranslationMatched(translation) && 
           matchedWord !== undefined && 
           this.expectedMatches.find(match => match.name === matchedWord)?.translatedName === translation;
  }

  resetState(): void {
    this.matches = {};
    this.selectedWordConnection = null;
    this.selectedTranslationConnection = null;
  }
}
