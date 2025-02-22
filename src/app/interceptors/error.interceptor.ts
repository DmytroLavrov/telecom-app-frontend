import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';

@Injectable()
export class errorInterceptor implements HttpInterceptor {
  private snackbarService = inject(SnackbarService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorMessage =
          error.error?.message || 'An unexpected error occurred';
        this.snackbarService.showMessage(errorMessage, 'error');
        return throwError(() => error);
      })
    );
  }
}
