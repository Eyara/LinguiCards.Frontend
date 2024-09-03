import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DictionarExtendedyModel, LanguageCreateModel, LanguageModel, LanguageResponseModel } from '../../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private apiUrl = '/api/Language';

  constructor(private http: HttpClient) {}

  getAllLanguages(): Observable<LanguageResponseModel[]> {
    return this.http.get<LanguageResponseModel[]>(`${this.apiUrl}/all`);
  }

  getDictionary(): Observable<DictionarExtendedyModel[]> {
    return this.http.get<DictionarExtendedyModel[]>(`${this.apiUrl}/dictionary`);
  }

  createLanguage(languageData: LanguageCreateModel): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}`, languageData);
  }

  deleteLanguage(languageId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}`, { params: { id: languageId } });
  }
}
