import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { UserInfoService } from './profile.service';
import { map, Observable, shareReplay } from 'rxjs';
import { LanguageStats, UserInfo } from '../../models/userInfo.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatDividerModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  languages$: Observable<LanguageStats[]>;

  constructor(private userInfoService: UserInfoService) { 
    this.languages$ = this.userInfoService.getUserInfo().pipe(
      shareReplay(1),
      map(userInfo => userInfo.languageStats)
    );
  }
}
