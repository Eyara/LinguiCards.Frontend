import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { CribResponseModel } from '../../models/crib.model';

@Injectable({
  providedIn: 'root'
})
export class GrammarService {
  private apiUrl = '/api/Crib';

  constructor(private http: HttpClient) {
  }

  getAllCribs(languageId: number): Observable<CribResponseModel[]> {
    return this.http.get<CribResponseModel[]>(`${this.apiUrl}/all`, {
      params: { languageId: languageId.toString() }
    });
  }
}