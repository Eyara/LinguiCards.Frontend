import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Подтверждение удаления</h2>
      <mat-dialog-content>
        Вы уверены, что хотите удалить эту сущность?
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onNoClick()">Отмена</button>
        <button mat-button color="warn" (click)="onYesClick()">Удалить</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 16px;
      max-width: 100%;
      box-sizing: border-box;
    }

    h2[mat-dialog-title] {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
      line-height: 1.2;
    }

    mat-dialog-content {
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.4;
    }

    mat-dialog-actions {
      margin: 0;
      padding: 0;
      min-height: 40px;
      display: flex;
      gap: 8px;
    }

    button[mat-button] {
      min-width: 64px;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 13px;
      letter-spacing: 0.5px;
      padding: 0 12px;
    }

    ::ng-deep .mat-mdc-dialog-container {
      --mdc-dialog-container-shape: 0;
    }

    @media (max-width: 599px) {
      .dialog-container {
        padding: 12px;
      }

      h2[mat-dialog-title] {
        font-size: 16px;
      }

      mat-dialog-content {
        margin: 8px 0;
        font-size: 13px;
      }

      mat-dialog-actions {
        min-height: 36px;
      }

      button[mat-button] {
        min-width: 56px;
        font-size: 12px;
        padding: 0 8px;
      }
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
} 