import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LanguageModel } from '../../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class SelectedLanguageService {
  private defaultLanguage!: LanguageModel;
  private selectedLanguageSubject: BehaviorSubject<LanguageModel> = new BehaviorSubject<LanguageModel>(this.defaultLanguage);
  public selectedLanguage$: Observable<LanguageModel> = this.selectedLanguageSubject.asObservable();

  constructor() { }

  setLanguage(language: LanguageModel): void {
    this.selectedLanguageSubject.next(language);
  }

  getSelectedLanguage(): LanguageModel {
    return this.selectedLanguageSubject.value;
  }
}
