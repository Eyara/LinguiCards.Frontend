import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingModel } from '../../models/training.model';
import { TranslationEvaluationResponse } from '../../models/translation-evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class TranslationPracticeService {
  private apiUrl = '/api';
  private translationEvaluationPath = '/TranslationEvaluation';

  constructor(private http: HttpClient) {}

  private buildParams(paramsObj: { [key: string]: any }): HttpParams {
    let params = new HttpParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }

  private getWithParams<T>(endpoint: string, paramsObj: { [key: string]: any }): Observable<T> {
    const params = this.buildParams(paramsObj);
    return this.http.get<T>(`${this.apiUrl}${endpoint}`, { params });
  }

  getEvaluation(length?: number, level?: string, topic?: string): Observable<string> {
    const params = this.buildParams({ length, level, topic });
    return this.http.get(`${this.apiUrl}${this.translationEvaluationPath}`, { params, responseType: 'text' });
  }

  evaluateTranslation(level: string, originalText: string, translation: string): Observable<TranslationEvaluationResponse> {
    return this.getWithParams<TranslationEvaluationResponse>(`${this.translationEvaluationPath}/evaluation`, { level, originalText, translation });
  }
}
