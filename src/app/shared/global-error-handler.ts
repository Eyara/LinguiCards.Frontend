import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private snackBar = inject(MatSnackBar);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    console.error('Unhandled error:', error);

    this.zone.run(() => {
      this.snackBar.open('Произошла непредвиденная ошибка.', 'Закрыть', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    });
  }
}
