import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '../../../shared/card/card.component';
import { ButtonComponent } from "../../../shared/button/button.component";
import { map, Observable, of, shareReplay, tap, switchMap } from 'rxjs';
import { DictionarExtendedyModel, LanguageCreateModel, LanguageModel } from '../../../models/language.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../language.service';
import { SelectedLanguageService } from '../selected-language.service';

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

  constructor(private router: Router, private languageService: LanguageService, private selectedLanguageService: SelectedLanguageService) {
    this.languageCards$ = this.getLanguageCards();
    this.languageDictionary$ = this.getAvailableLanguages();
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
        tap(() => {
          this.languageCards$ = this.getLanguageCards()
          this.languageDictionary$ = this.getAvailableLanguages();
        })
      );
  }

  getLanguageCards(): Observable<LanguageModel[]> {
    return this.languageService.getAllLanguages()
      .pipe(
        shareReplay(1),
        map(languages => languages.map(language => ({ ...language, editMode: false })))
      );
  }

  getAvailableLanguages(): Observable<DictionarExtendedyModel[]> {
    return this.languageService.getAvailableLanguages()
      .pipe(
        shareReplay(1),
      );
  }

  navigateToOverview(language: LanguageModel) {
    if (language) {
      this.selectedLanguageService.setLanguage(language);
      this.router.navigate(['/language-overview', language.id]);
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
          this.languageDictionary$ = this.getAvailableLanguages();
        }),
        map(() => true)
      );
  }
}
