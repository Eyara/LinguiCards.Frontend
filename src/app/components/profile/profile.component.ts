import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserInfoService } from './profile.service';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { LanguageStat } from '../../models/userInfo.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UserSettings } from '../../models/user-settings.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    MatProgressBarModule, 
    MatInputModule,
    MatButtonModule,
    FormsModule
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
  userSettings$: Observable<UserSettings>;
  saveUserSettings$: Observable<void | null> = of(null);
  activeTrainingSize: number = 0;
  passiveTrainingSize: number = 0;
  dailyGoalXp: number = 0;

  constructor(private userInfoService: UserInfoService) { 
    this.languages$ = this.userInfoService.getUserInfo().pipe(
      shareReplay(1),
      tap(userInfo => {
        this.level = userInfo.level;
        this.xp = userInfo.xp;
        this.xpToNextLevel = userInfo.xpToNextLevel;
        this.dailyXp = userInfo.dailyXp;
      }),
      map(userInfo => userInfo.languageStats)
    );

    this.userSettings$ = this.userInfoService.getUserSettings().pipe(
      shareReplay(1),
      tap(settings => {
        this.activeTrainingSize = settings.activeTrainingSize;
        this.passiveTrainingSize = settings.passiveTrainingSize;
        this.dailyGoalXp = settings.dailyGoalXp;
      })
    );
  }

  saveSettings(): void {
    this.saveUserSettings$ = this.userInfoService.createOrUpdateUserSettings(
      this.activeTrainingSize,
      this.passiveTrainingSize,
      this.dailyGoalXp
    ).pipe(
      tap(() => console.log('Settings saved successfully')),
      catchError((error: unknown) => {
        console.error('Error saving settings:', error);
        return of(null);
      })
    );
  }
}
