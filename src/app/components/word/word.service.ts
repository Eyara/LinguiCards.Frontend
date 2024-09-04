import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WordCreateModel, WordModel } from '../../models/word.model';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getUnlearnedWords(languageId: number): Observable<WordModel[]> {
    return this.http.get<WordModel[]>(`${this.apiUrl}/Word/unlearned`, {
      params: { languageId: languageId.toString() }
    });
  }

  addWordToLanguage(languageId: number, word: WordCreateModel): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/Language/${languageId}/Word`, word);
  }

  updateLearnLevel(updateData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Word/updateLearnLevel`, updateData);
  }

  deleteWord(wordId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Word`,
        {
            params: { id: wordId.toString() }
        }
    );
  }
}