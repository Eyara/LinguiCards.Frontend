import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DictionarExtendedyModel, LanguageCreateModel, LanguageResponseModel, LanguageStatisticsModel} from '../../models/language.model';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private apiUrl = '/api/Language';

  constructor(private http: HttpClient) {
  }

  getAllLanguages(): Observable<LanguageResponseModel[]> {
    return this.http.get<LanguageResponseModel[]>(`${this.apiUrl}/all`);
  }

  getAvailableLanguages(): Observable<DictionarExtendedyModel[]> {
    return this.http.get<DictionarExtendedyModel[]>(`${this.apiUrl}/available`);
  }

  getDictionary(): Observable<DictionarExtendedyModel[]> {
    return this.http.get<DictionarExtendedyModel[]>(`${this.apiUrl}/dictionary`);
  }

  getLanguageStatistics(languageId: number): Observable<LanguageStatisticsModel> {
    return this.http.get<LanguageStatisticsModel>(`${this.apiUrl}/stats`, {params: {languageId: languageId.toString()}});
  }

  createLanguage(languageData: LanguageCreateModel): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}`, languageData);
  }

  deleteLanguage(languageId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}`, {params: {id: languageId}});
  }
}
