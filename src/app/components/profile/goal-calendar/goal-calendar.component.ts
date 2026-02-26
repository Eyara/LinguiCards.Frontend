import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GoalDay } from '../../../models/userInfo.model';
import { DayDetailDialogComponent } from './day-detail-dialog/day-detail-dialog.component';

export interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCompleted: boolean;
  isToday: boolean;
  isEmpty?: boolean;
  xp?: number;
  targetXp?: number;
  byTranslation?: number;
  byGrammar?: number;
}

interface DayXpData {
  xp?: number;
  targetXp?: number;
  byTranslation?: number;
  byGrammar?: number;
  isCompleted: boolean;
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
  @Input() goalDays: GoalDay[] = [];

  private readonly DAYS_TO_DISPLAY = 30;

  private goalDaysMap: Map<string, DayXpData> = new Map();
  calendarDays: CalendarDay[] = [];
  completedDaysInRange: number = 0;

  constructor(private dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['goalDays']) {
      this.updateGoalDaysMap();
      this.updateCalendarDays();
    }
  }

  private updateGoalDaysMap(): void {
    this.goalDaysMap = new Map();
    this.goalDays.forEach(day => {
      if (day.date) {
        const dateKey = day.date.slice(0, 10);
        this.goalDaysMap.set(dateKey, {
          xp: day.xp,
          targetXp: day.targetXp,
          byTranslation: day.byTranslation,
          byGrammar: day.byGrammar,
          isCompleted: day.isCompleted,
        });
      }
    });
  }

  private updateCalendarDays(): void {
    const days: CalendarDay[] = [];
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

    const firstDay = new Date(today);
    firstDay.setUTCDate(firstDay.getUTCDate() - (this.DAYS_TO_DISPLAY - 1));

    let firstDayOfWeek = firstDay.getUTCDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        date: 0,
        month: 0,
        year: 0,
        isCompleted: false,
        isToday: false,
        isEmpty: true
      });
    }

    let completedCount = 0;

    for (let i = this.DAYS_TO_DISPLAY - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - i);

      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();

      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = this.goalDaysMap.get(dateKey);
      const isCompleted = dayData?.isCompleted ?? false;

      if (isCompleted) {
        completedCount++;
      }

      days.push({
        date: day,
        month: month,
        year: year,
        isCompleted,
        isToday: i === 0,
        isEmpty: false,
        xp: dayData?.xp,
        targetXp: dayData?.targetXp,
        byTranslation: dayData?.byTranslation,
        byGrammar: dayData?.byGrammar,
      });
    }

    this.calendarDays = days;
    this.completedDaysInRange = completedCount;
  }

  onDayClick(day: CalendarDay): void {
    if (day.isEmpty) {
      return;
    }
    this.dialog.open(DayDetailDialogComponent, {
      data: day,
      width: '280px',
      autoFocus: false,
      panelClass: 'day-detail-dialog-panel',
    });
  }

  getDayTooltip(day: CalendarDay): string {
    if (day.isEmpty) {
      return '';
    }
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
