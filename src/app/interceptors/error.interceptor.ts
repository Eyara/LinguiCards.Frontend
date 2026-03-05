import { inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

const ERROR_MESSAGES: Record<number, string> = {
  0: 'Сервер недоступен. Проверьте подключение к интернету.',
  400: 'Некорректный запрос.',
  403: 'Доступ запрещён.',
  404: 'Ресурс не найден.',
  408: 'Время ожидания истекло.',
  429: 'Слишком много запросов. Попробуйте позже.',
  500: 'Внутренняя ошибка сервера.',
  502: 'Сервер временно недоступен.',
  503: 'Сервис недоступен.',
};

export function errorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const snackBar = inject(MatSnackBar);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return throwError(() => error);
      }

      const message = ERROR_MESSAGES[error.status] ?? `Ошибка: ${error.status} — ${error.statusText || 'Неизвестная ошибка'}`;
      snackBar.open(message, 'Закрыть', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });

      return throwError(() => error);
    })
  );
}
