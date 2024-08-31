import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '../../../shared/card/card.component';
import { ButtonComponent } from "../../../shared/button/button.component";
import { map, Observable, of } from 'rxjs';
import { LanguageModel } from '../../../models/language.model';
import { CommonModule } from '@angular/common';
import { CountryModel } from '../../../models/country.model';
import { Router, RouterModule } from '@angular/router';

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

  constructor(private router: Router) {
    this.languageCards$ = this.getLanguageCards();
  }

  getLanguageCards(): Observable<LanguageModel[]> {
    // this.languageCards$ = this.languageService.getLanguageCards();

    return of([
      { id: 1, name: 'Русский', imgSrc: 'https://flagcdn.com/ru.svg' } as LanguageModel,
      { id: 2, name: 'Английский', imgSrc: 'https://flagcdn.com/gb.svg' } as LanguageModel,
    ]);
  }

  addLanguage() {
    this.languageCards$ = this.languageCards$
      .pipe(
        map(cards => [...cards,
        {
          editMode: true,
          countries: [{ id: 1, name: 'Русский', flagSrc: 'https://flagcdn.com/ru.svg' } as CountryModel, { id: 2, name: 'Английский', flagSrc: 'https://flagcdn.com/gb.svg' } as CountryModel]
        } as LanguageModel])
      );
  }


  saveLanguage(model: LanguageModel) {
    this.languageCards$ = this.getLanguageCards();
  }


  navigateToWordPage(id: number) {
    this.router.navigate(['/word-page', id]);
  }
}
