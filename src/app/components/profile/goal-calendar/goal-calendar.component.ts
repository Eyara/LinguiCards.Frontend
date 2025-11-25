import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CompletedGoalDay } from '../../../models/userInfo.model';

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCompleted: boolean;
  isToday: boolean;
}

@Component({
  selector: 'app-goal-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goal-calendar.component.html',
  styleUrls: ['./goal-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalCalendarComponent implements OnChanges {
  @Input() completedGoalDays: CompletedGoalDay[] = [];

  completedDaysSet: Set<string> = new Set();
  calendarDays: CalendarDay[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['completedGoalDays']) {
      this.updateCompletedDaysSet();
      this.updateCalendarDays();
    }
  }

  private updateCompletedDaysSet(): void {
    this.completedDaysSet = new Set();
    this.completedGoalDays.forEach(day => {
      const dateKey = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
      this.completedDaysSet.add(dateKey);
    });
  }

  private updateCalendarDays(): void {
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      const isCompleted = this.isDayCompleted(year, month, day);
      
      days.push({
        date: day,
        month: month,
        year: year,
        isCompleted,
        isToday: i === 0
      });
    }
    
    this.calendarDays = days;
  }

  private isDayCompleted(year: number, month: number, day: number): boolean {
    if (this.completedDaysSet.size === 0) {
      return false;
    }
    
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return this.completedDaysSet.has(dateKey);
  }

  getDayTooltip(day: CalendarDay): string {
    const dateStr = `${day.date}.${day.month}.${day.year}`;
    if (day.isToday && day.isCompleted) {
      return `Сегодня - Цель выполнена! (${dateStr})`;
    } else if (day.isToday) {
      return `Сегодня - Цель не выполнена (${dateStr})`;
    } else if (day.isCompleted) {
      return `Цель выполнена (${dateStr})`;
    }
    return `Цель не выполнена (${dateStr})`;
  }
}

