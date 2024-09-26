import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '../../../shared/card/card.component';
import { ButtonComponent } from "../../../shared/button/button.component";
import { map, Observable, of, shareReplay, tap, switchMap, mergeMap, combineLatest } from 'rxjs';
import { DictionarExtendedyModel, LanguageCreateModel, LanguageModel } from '../../../models/language.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../language.service';

@Component({
  selector: 'language-page',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, RouterModule],
  templateUrl: './language-page.component.html',
  styleUrl: './language-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguagePageComponent {
  languageCards$: Observable<LanguageModel[]>;
  languageDictionary$: Observable<DictionarExtendedyModel[]>;
  languageCreateObservable$: Observable<boolean> | undefined;
  languageCloseObservable$: Observable<boolean> | undefined;

  constructor(private router: Router, private languageService: LanguageService) {
    this.languageCards$ = this.getLanguageCards();
    this.languageDictionary$ = combineLatest([
      this.languageService.getDictionary().pipe(shareReplay(1)),
      this.languageCards$
    ])
      .pipe(
        map(([dictionary, languageCards]) =>
          dictionary.filter(dict =>
            languageCards.find(card => card.name !== dict.name)
          ))
      ),
      shareReplay(1);
  }

  addLanguage() {
    this.languageCards$ = this.languageCards$
      .pipe(
        map(cards => [...cards,
        {
          id: 0,
          editMode: true
        } as LanguageModel])
      );
  }

  saveLanguage(model: LanguageCreateModel) {
    this.languageCreateObservable$ = this.languageService.createLanguage(model)
      .pipe(
        tap(() => this.languageCards$ = this.getLanguageCards())
      );
  }

  getLanguageCards(): Observable<LanguageModel[]> {
    return this.languageService.getAllLanguages()
      .pipe(
        shareReplay(1),
        map(languages => languages.map(language => ({ ...language, editMode: false })))
      );
  }

  navigateToWordPage(id: number) {
    if (id) {
      this.router.navigate(['/word-page', id]);
    }
  }

  closeLanguage(id: number) {
    this.languageCloseObservable$ = this.languageCards$
      .pipe(
        map(cards => {
          const cardToRemove = cards.find(card => card.id === id);
          const filteredCards = cards.filter(card => card.id !== id);
          return { cardToRemove, filteredCards };
        }),
        switchMap(({ cardToRemove, filteredCards }) => {
          if (!cardToRemove?.editMode && cardToRemove) {
            return this.languageService.deleteLanguage(cardToRemove.id.toString()).pipe(
              map(() => filteredCards)
            );
          } else {
            return of(filteredCards);
          }
        }),
        tap(updatedCards => {
          this.languageCards$ = of(updatedCards);
        }),
        map(() => true)
      );
  }
}
