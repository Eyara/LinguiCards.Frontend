import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EditMode, WordCreateModel, WordModel, WordViewModel } from '../../../models/word.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Observable, of, tap } from 'rxjs';
import { WordService } from '../word.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'word-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, RouterModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './word-page.component.html',
  styleUrl: './word-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordPageComponent {
  languageId: number;
  words$: Observable<WordViewModel[]> = of([]);
  wordCommandObservable$: Observable<boolean> | undefined;

  constructor(private route: ActivatedRoute, private wordService: WordService) {
    this.languageId = this.route.snapshot.params['id'];
    this.words$ = this.getWords();
  }

  isEditMode(word: WordViewModel): boolean {
    return word.editMode === EditMode.Update || word.editMode === EditMode.Create;
  }

  getWords(): Observable<WordViewModel[]> {
    return this.wordService.getAllWords(this.languageId).pipe(
      map(words => words.map(word => ({ ...word, editMode: EditMode.None })))
    );
  }

  addWord() {
    this.words$ = this.words$.pipe(
      map(words => [
        { id: 0, name: '', translatedName: '', learnedPercent: 0, languageId: this.languageId, editMode: EditMode.Create },
        ...words
      ])
    );
  }

  editWord(word: WordViewModel) {
    this.words$ = this.words$.pipe(
      map(words => words.map(w => w.id === word.id ? { ...w, editMode: EditMode.Update } : w))
    );
  }

  finishEditing(model: WordViewModel) {
    console.log(model);
    if (model.editMode === EditMode.Create) {
      this.createWord(model);
    } else if (model.editMode === EditMode.Update) {
      this.updateWord(model);
    }
  }

  createWord(model: WordModel) {
    const createModel: WordCreateModel = {
      name: model.name,
      translatedName: model.translatedName
    };

    this.wordCommandObservable$ = this.wordService.addWordToLanguage(this.languageId, createModel)
      .pipe(
        tap(() =>
          this.words$ = this.getWords())
      )
  }

  updateWord(model: WordModel) {
    this.wordCommandObservable$ = this.wordService.updateWord(model.id, model.name, model.translatedName)
      .pipe(
        tap(() =>
          this.words$ = this.getWords())
      );
  }

  deleteWord(word: WordModel) {
    this.wordCommandObservable$ = this.wordService.deleteWord(word.id)
      .pipe(
        tap(() =>
          this.words$ = this.getWords())
      )
  }
}
