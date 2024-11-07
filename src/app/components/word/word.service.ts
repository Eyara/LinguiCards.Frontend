import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingType, WordCreateModel, WordModel, WordTrainingModel } from '../../models/word.model';
import { Paginated } from '../../models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {
  }

  getAllPaginatedWords(
    languageId: number,
    page: number = 1,
    pageSize: number = 15,
    nameFilterQuery?: string,
    translationNameFilterQuery?: string
  ): Observable<Paginated<WordModel[]>> {
    return this.http.get<Paginated<WordModel[]>>(`${this.apiUrl}/Language/${languageId}/Word`, {
      params: {
        pageNumber: page.toString(),
        pageSize: pageSize.toString(),
        ...(nameFilterQuery && { nameFilterQuery }),
        ...(translationNameFilterQuery && { translationNameFilterQuery })
      }
    });
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

  updateLearnLevel(wordId: number, wasSuccessful: boolean, trainingType: TrainingType, trainingId: string, answer: string): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/Word/updateLearnLevel`, null, {
      params: {
        wordId: wordId.toString(),
        wasSuccessful: wasSuccessful.toString(),
        trainingType: trainingType,
        trainingId: trainingId,
        answer: answer
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
