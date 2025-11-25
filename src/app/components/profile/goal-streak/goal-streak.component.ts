import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-goal-streak',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal-streak.component.html',
  styleUrls: ['./goal-streak.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalStreakComponent {
  @Input() goalStreak: number = 0;

  getStreakLabel(days: number): string {
    if (days === 1) return 'день подряд';
    if (days >= 2 && days <= 4) return 'дня подряд';
    return 'дней подряд';
  }
}

