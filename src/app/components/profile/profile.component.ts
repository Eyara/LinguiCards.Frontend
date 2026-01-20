import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UserInfoService } from './profile.service';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { CompletedGoalDayInput, LanguageStat } from '../../models/userInfo.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserSettings } from '../../models/user-settings.model';
import { GoalStreakComponent } from './goal-streak/goal-streak.component';
import { GoalCalendarComponent } from './goal-calendar/goal-calendar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatProgressBarModule, 
    MatInputModule,
    MatButtonModule,
    FormsModule,
    GoalStreakComponent,
    GoalCalendarComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  languages$: Observable<LanguageStat[]>;
  level: number = 0;
  xp: number = 0;
  xpToNextLevel: number = 0;
  dailyXp: number = 0;
  byTranslation: number = 0;
  byGrammar: number = 0;
  goalStreak: number = 0;
  completedGoalDays: CompletedGoalDayInput[] = [];
  userSettings$: Observable<UserSettings>;
  saveUserSettings$: Observable<void | null> = of(null);
  activeTrainingSize: number = 0;
  passiveTrainingSize: number = 0;
  dailyGoalXp: number = 0;
  dailyGoalByTranslation: number = 0;
  dailyGoalByGrammar: number = 0;

  constructor(
    private userInfoService: UserInfoService,
    private cdr: ChangeDetectorRef
  ) { 
    this.languages$ = this.userInfoService.getUserInfo().pipe(
      shareReplay(1),
      tap(userInfo => {
        this.level = userInfo.level;
        this.xp = userInfo.xp;
        this.xpToNextLevel = userInfo.xpToNextLevel;
        this.dailyXp = userInfo.dailyXp;
        this.byTranslation = userInfo.byTranslation ?? 0;
        this.byGrammar = userInfo.byGrammar ?? 0;
        this.goalStreak = userInfo.goalStreak;
        this.completedGoalDays = userInfo.completedGoalDays || [];
        this.cdr.markForCheck();
      }),
      map(userInfo => userInfo.languageStats)
    );

    this.userSettings$ = this.userInfoService.getUserSettings().pipe(
      shareReplay(1),
      tap(settings => {
        this.activeTrainingSize = settings.activeTrainingSize;
        this.passiveTrainingSize = settings.passiveTrainingSize;
        this.dailyGoalXp = settings.dailyGoalXp;
        this.dailyGoalByTranslation = settings.dailyGoalByTranslation ?? 0;
        this.dailyGoalByGrammar = settings.dailyGoalByGrammar ?? 0;
      })
    );
  }

  saveSettings(): void {
    this.saveUserSettings$ = this.userInfoService.createOrUpdateUserSettings(
      this.activeTrainingSize,
      this.passiveTrainingSize,
      this.dailyGoalXp,
      this.dailyGoalByTranslation,
      this.dailyGoalByGrammar
    ).pipe(
      tap(() => console.log('Settings saved successfully')),
      catchError((error: unknown) => {
        console.error('Error saving settings:', error);
        return of(null);
      })
    );
  }

  roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

}
