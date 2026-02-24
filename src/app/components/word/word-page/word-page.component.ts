import { ChangeDetectionStrategy, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { EditMode, WordCreateModel, WordModel, WordViewModel } from '../../../models/word.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Observable, of, tap, shareReplay, switchMap } from 'rxjs';
import { WordService } from '../word.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'word-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './word-page.component.html',
  styleUrl: './word-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordPageComponent implements OnInit, AfterViewInit {
  languageId!: number;
  totalCount: number = 0;
  pageIndex: number = 0;

  words$: Observable<WordViewModel[]> = of([]);
  wordCommandObservable$: Observable<boolean> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  nameFilter: string = '';
  translationFilter: string = '';

  constructor(
    private route: ActivatedRoute,
    private wordService: WordService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(params => {
        this.languageId = +params.get('languageId')!;
      })
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.loadWords();
  }

  isEditMode(word: WordViewModel): boolean {
    return word.editMode === EditMode.Update || word.editMode === EditMode.Create;
  }

  getWords(pageIndex: number, pageSize: number, nameFilterQuery?: string, translationNameFilterQuery?: string): Observable<WordViewModel[]> {
    return this.wordService.getAllPaginatedWords(this.languageId, pageIndex + 1, pageSize, nameFilterQuery, translationNameFilterQuery).pipe(
      shareReplay(1),
      tap(response => this.totalCount = response.totalCount),
      map(response => response.items.map(word => ({ ...word, editMode: EditMode.None } as unknown as WordViewModel)))
    );
  }

  addWord() {
    this.words$ = this.words$.pipe(
      map(words => [
        { id: 0, name: '', translatedName: '', activeLearnedPercent: 0, passiveLearnedPercent: 0, lastUpdated: '', languageId: this.languageId, editMode: EditMode.Create },
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
        tap(() => this.loadWords())
      );
  }

  updateWord(model: WordModel) {
    this.wordCommandObservable$ = this.wordService.updateWord(model.id, model.name, model.translatedName)
      .pipe(
        tap(() => this.loadWords())
      );
  }

  deleteWord(word: WordModel) {
    this.wordCommandObservable$ = this.dialog.open(ConfirmationDialogComponent, {
      panelClass: 'confirmation-dialog'
    }).afterClosed().pipe(
      switchMap(result => {
        if (result) {
          return this.wordService.deleteWord(word.id).pipe(
            tap(() => this.loadWords())
          );
        }
        return of(false);
      })
    );
  }

  handlePageEvent(e: PageEvent) {
    this.pageIndex = e.pageIndex;
    this.loadWords();
  }

  clearNameFilter() {
    this.nameFilter = '';
    this.applyFilters();
  }

  clearTranslationFilter() {
    this.translationFilter = '';
    this.applyFilters();
  }

  applyFilters() {
    this.pageIndex = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
    this.loadWords();
  }

  resetFilters() {
    this.nameFilter = '';
    this.translationFilter = '';
    this.applyFilters();
  }

  loadWords() {
    const pageSize = this.paginator?.pageSize ?? 5;
    this.words$ = this.getWords(this.pageIndex, pageSize, this.nameFilter, this.translationFilter);
  }
}
