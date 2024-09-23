import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WordCreateModel, WordModel, WordTrainingModel } from '../../models/word.model';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {
  }

  getAllWords(languageId: number): Observable<WordModel[]> {
    return this.http.get<WordModel[]>(`${this.apiUrl}/Language/${languageId}/Word`);
  }

  getUnlearnedWords(languageId: number): Observable<WordTrainingModel[]> {
    return this.http.get<WordTrainingModel[]>(`${this.apiUrl}/Word/unlearned`, {
      params: { languageId: languageId.toString() }
    });
  }

  addWordToLanguage(languageId: number, word: WordCreateModel): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/Language/${languageId}/Word`, word);
  }

  updateWord(wordId: number, name: string, translationName: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/Word`, null, {
      params: {
        wordId: wordId.toString(),
        name: name,
        translationName: translationName
      }
    });
  }

  updateLearnLevel(wordId: number, wasSuccessful: boolean): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/Word/updateLearnLevel`, null, {
      params: {
        wordId: wordId.toString(),
        wasSuccessful: wasSuccessful.toString()
      }
    });
  }

  deleteWord(wordId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/Word`,
      {
        params: { id: wordId.toString() }
      }
    );
  }
}
