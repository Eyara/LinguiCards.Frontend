import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CompletedGoalDayInput } from '../../../models/userInfo.model';

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
  @Input() completedGoalDays: CompletedGoalDayInput[] = [];

  private readonly DAYS_TO_DISPLAY = 30;

  completedDaysSet: Set<string> = new Set();
  calendarDays: CalendarDay[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['completedGoalDays']) {
      this.updateCompletedDaysSet();
      this.updateCalendarDays();
    }
  }

  private updateCompletedDaysSet(): void {
    console.log('Completed goal days:', this.completedGoalDays);
    this.completedDaysSet = new Set();
    this.completedGoalDays.forEach(day => {
      let dateKey: string | null = null;
      
      // Handle string format: '2025-11-25'
      if (typeof day === 'string') {
        if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
          dateKey = day;
        }
      }
      // Handle object format: { year: 2025, month: 11, day: 25 }
      else if (day && typeof day === 'object' && day.year != null && day.month != null && day.day != null) {
        dateKey = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
      }
      
      if (dateKey) {
        this.completedDaysSet.add(dateKey);
      }
    });
    console.log('Completed days set:', this.completedDaysSet);
  }

  private updateCalendarDays(): void {
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = this.DAYS_TO_DISPLAY - 1; i >= 0; i--) {
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

