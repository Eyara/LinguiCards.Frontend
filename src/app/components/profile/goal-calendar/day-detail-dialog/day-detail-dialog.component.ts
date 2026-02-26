import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarDay } from '../goal-calendar.component';

@Component({
  selector: 'app-day-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './day-detail-dialog.component.html',
  styleUrl: './day-detail-dialog.component.scss'
})
export class DayDetailDialogComponent {
  private readonly monthNames = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CalendarDay,
    private dialogRef: MatDialogRef<DayDetailDialogComponent>
  ) {}

  getMonthName(): string {
    return this.monthNames[this.data.month - 1] ?? '';
  }

  hasXpData(): boolean {
    return this.data.xp != null || this.data.byTranslation != null || this.data.byGrammar != null;
  }

  close(): void {
    this.dialogRef.close();
  }
}
