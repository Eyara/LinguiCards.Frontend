import { Injectable, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
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
    languageDictionaryId: 0,
    userId: 0
  };

  private selectedLanguageSignal = signal<LanguageModel>(this.loadFromStorage());
  public currentLanguage = computed(() => this.selectedLanguageSignal());
  public selectedLanguage$: Observable<LanguageModel> = toObservable(this.selectedLanguageSignal);

  setLanguage(language: LanguageModel): void {
    localStorage.setItem('selectedLanguage', JSON.stringify(language));
    this.selectedLanguageSignal.set(language);
  }

  getSelectedLanguage(): LanguageModel {
    return this.selectedLanguageSignal();
  }

  clear(): void {
    localStorage.removeItem('selectedLanguage');
    this.selectedLanguageSignal.set(this.defaultLanguage);
  }

  private loadFromStorage(): LanguageModel {
    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage) {
      return JSON.parse(storedLanguage);
    }
    return this.defaultLanguage;
  }
}
