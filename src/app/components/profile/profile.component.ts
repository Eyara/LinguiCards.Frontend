import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UserInfoService } from './profile.service';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { LanguageStats } from '../../models/userInfo.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
  languages$: Observable<LanguageStats[]>;
  level: number = 0;
  xp: number = 0;
  xpToNextLevel: number = 0;

  constructor(private userInfoService: UserInfoService) { 
    this.languages$ = this.userInfoService.getUserInfo().pipe(
      shareReplay(1),
      tap(userInfo => {
        this.level = userInfo.level;
        this.xp = userInfo.xp;
        this.xpToNextLevel = userInfo.xpToNextLevel;
      }),
      map(userInfo => userInfo.languageStats)
    );
  }
}
