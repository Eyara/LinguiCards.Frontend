import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrainingModel } from '../../models/training.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getTrainingById(trainingId: string): Observable<TrainingModel[]> {
    return this.http.get<TrainingModel[]>(`${this.apiUrl}/Training/${trainingId}`);
  }
}
