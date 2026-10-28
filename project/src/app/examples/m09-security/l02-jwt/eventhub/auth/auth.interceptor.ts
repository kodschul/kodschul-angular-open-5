import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../data';
import { AuthService } from './auth.service';
import { LOGIN_URL } from './login-url';

/** Hängt das Token an jede Anfrage an die API und reagiert zentral auf 401. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const loginUrl = inject(LOGIN_URL);

  const token = auth.token();
  const isApiCall = req.url.startsWith(API_URL); // Token nie an fremde Hosts schicken
  const request = token && isApiCall ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      const isLoginCall = req.url.endsWith('/auth/login'); // falsches Passwort ist kein Ablauf
      if (error instanceof HttpErrorResponse && error.status === 401 && isApiCall && !isLoginCall) {
        auth.logout();
        void router.navigate([loginUrl], { queryParams: { returnUrl: router.url, reason: 'expired' } });
      }
      return throwError(() => error); // Fehler weiterreichen: Komponente zeigt ihn ebenfalls
    }),
  );
};
