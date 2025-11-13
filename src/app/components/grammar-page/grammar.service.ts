import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import { CribResponseModel } from '../../models/crib.model';
import { GrammarTaskType } from '../../models/grammar-task.model';

@Injectable({
  providedIn: 'root'
})
export class GrammarService {
  private apiUrl = '/api';
  private cribPath = '/Crib';
  private grammarTaskPath = '/GrammarTask';

  constructor(private http: HttpClient) {
  }

  private buildParams(paramsObj: { [key: string]: unknown }): HttpParams {
    let params = new HttpParams();
    Object.entries(paramsObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });
    return params;
  }

  getAllCribs(languageId: number): Observable<CribResponseModel[]> {
    return this.http.get<CribResponseModel[]>(`${this.apiUrl}${this.cribPath}/all`, {
      params: { languageId: languageId.toString() }
    });
  }

  getGrammarTaskTypes(): Observable<GrammarTaskType[]> {
    return this.http.get<GrammarTaskType[]>(`${this.apiUrl}${this.grammarTaskPath}/types`);
  }

  getGrammarTask(languageId: number, level?: string, topic?: string, type?: string): Observable<string> {
    const params = this.buildParams({ languageId, level, topic, type });
    return this.http.get(`${this.apiUrl}${this.grammarTaskPath}`, { params, responseType: 'text' });
  }

  evaluateGrammarTask(languageId: number, level: string, taskText: string, userAnswer: string, topic?: string, type?: string): Observable<string> {
    const params = this.buildParams({ languageId, level, taskText, userAnswer, topic, type });
    return this.http.post(`${this.apiUrl}${this.grammarTaskPath}/evaluation`, null, { params, responseType: 'text' as 'json' }) as Observable<string>;
  }
}