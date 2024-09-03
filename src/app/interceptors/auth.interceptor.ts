import { inject } from '@angular/core';
import { HttpRequest, HttpEvent, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    const router = inject(Router);

    if (token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                router.navigate(['/sign-in']);
            }
            return throwError(() => error);
        })
    );
}