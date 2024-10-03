import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LanguageModel } from '../../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedLanguageService {
  private defaultLanguage: LanguageModel = {
    id: 0,
    name: '',
    editMode: false,
    url: '',
    languageDictionaryId: 0
  };
  private selectedLanguageSubject: BehaviorSubject<LanguageModel> = new BehaviorSubject<LanguageModel>(this.defaultLanguage);
  public selectedLanguage$: Observable<LanguageModel> = this.selectedLanguageSubject.asObservable();

  constructor() {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      this.selectedLanguageSubject.next(JSON.parse(storedLanguage));
    }
  }

  setLanguage(language: LanguageModel): void {
    localStorage.setItem('selectedLanguage', JSON.stringify(language));
    this.selectedLanguageSubject.next(language);
  }

  getSelectedLanguage(): LanguageModel {
    return this.selectedLanguageSubject.value;
  }

  getSelectedLanguageSubject$(): BehaviorSubject<LanguageModel> {
    return this.selectedLanguageSubject;
  }

  clear(): void {
    localStorage.removeItem('selectedLanguage');
    this.selectedLanguageSubject.next(this.defaultLanguage);
  }
}
