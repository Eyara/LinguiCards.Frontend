import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { GrammarService } from '../grammar-page/grammar.service';
import { GrammarTaskType } from '../../models/grammar-task.model';
import { BehaviorSubject, Observable, of, switchMap, map, startWith, shareReplay } from 'rxjs';

@Component({
  selector: 'app-grammar-task',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './grammar-task.component.html',
  styleUrl: './grammar-task.component.scss'
})
export class GrammarTaskComponent implements OnInit {
  level = '';
  topic = '';
  selectedTypeName = '';
  userAnswer = '';
  languageId: number | null = null;
  taskTypes: GrammarTaskType[] = [];

  private getTaskTrigger$ = new BehaviorSubject<void>(undefined);
  private evaluateTrigger$ = new BehaviorSubject<void>(undefined);

  taskText$: Observable<string>;
  evaluationResult$: Observable<string | null>;

  isLoadingTask$ = new BehaviorSubject<boolean>(false);
  isLoadingEval$ = new BehaviorSubject<boolean>(false);

  languageLevels = [
    { value: 'A1', label: 'Начальный (A1)' },
    { value: 'A2', label: 'Элементарный (A2)' },
    { value: 'B1', label: 'Средний (B1)' },
    { value: 'B2', label: 'Выше среднего (B2)' },
    { value: 'C1', label: 'Продвинутый (C1)' },
    { value: 'C2', label: 'В совершенстве (C2)' }
  ];

  constructor(
    private grammarService: GrammarService,
    private route: ActivatedRoute
  ) {
    const paramId = this.route.snapshot.params['languageId'];
    if (paramId) {
      this.languageId = +paramId;
    }

    this.taskText$ = this.getTaskTrigger$.pipe(
      switchMap(() => {
        if (!this.level || !this.languageId) return of('');
        this.isLoadingTask$.next(true);
        return this.grammarService.getGrammarTask(this.languageId, this.level, this.topic, this.selectedTypeName || undefined).pipe(
          map(text => {
            this.isLoadingTask$.next(false);
            return text.trim();
          }),
          startWith('')
        );
      }),
      shareReplay(1)
    );

    this.evaluationResult$ = this.evaluateTrigger$.pipe(
      switchMap(() => {
        if (!this.userAnswer.trim() || !this.level || !this.languageId) return of(null);
        this.isLoadingEval$.next(true);
        return this.taskText$.pipe(
          switchMap(taskText => {
            if (!taskText) {
              this.isLoadingEval$.next(false);
              return of(null);
            }
            return this.grammarService.evaluateGrammarTask(
              this.languageId!,
              this.level,
              taskText,
              this.userAnswer,
              this.topic,
              this.selectedTypeName || undefined
            ).pipe(
              map(result => {
                this.isLoadingEval$.next(false);
                return result;
              })
            );
          })
        );
      })
    );
  }

  ngOnInit() {
    this.grammarService.getGrammarTaskTypes().subscribe((types: GrammarTaskType[]) => {
      this.taskTypes = types;
    });
  }

  getTask() {
    this.getTaskTrigger$.next();
    this.userAnswer = '';
    this.evaluateTrigger$.next();
  }

  evaluateTask() {
    this.evaluateTrigger$.next();
  }
}

