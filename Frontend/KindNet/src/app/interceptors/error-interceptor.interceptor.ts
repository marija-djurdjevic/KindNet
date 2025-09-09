import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private toastService: ToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Dogodila se nepoznata greška.';

        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 401) {
          errorMessage = 'Nemate dozvolu za pristup.';
        } else if (error.status === 404) {
          errorMessage = 'Traženi sadržaj nije pronađen.';
        } else if (error.status === 500) {
          errorMessage = 'Greška na serveru.';
        } else {
          errorMessage = `Greška: ${error.status} - ${error.statusText}`;
        }

        if (!(error.status === 404 && request.url.includes('/profiles/volunteer'))) {
          this.toastService.error(errorMessage);
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
