import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingModel } from '../../models/training.model';
import { API_BASE_URL } from '../../shared/api.token';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = inject(API_BASE_URL);

  constructor(private http: HttpClient) {}

  getTrainingById(trainingId: string): Observable<TrainingModel[]> {
    return this.http.get<TrainingModel[]>(`${this.apiUrl}/Training/${trainingId}`);
  }
}
