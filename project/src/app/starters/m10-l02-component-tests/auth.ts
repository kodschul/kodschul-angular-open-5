import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { CanMatchFn, Router } from '@angular/router';
import { User } from '../../shared/models';

// Code unter Test: vereinfachte Kopie von AuthService, Interceptor und Guard aus Lab 9.2.

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly token = signal<string | null>(null);
  readonly user = signal<User | null>(null);
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  setSession(token: string, user: User): void {
    this.token.set(token);
    this.user.set(user);
  }

  logout(): void {
    this.token.set(null);
    this.user.set(null);
  }
}

/** Hängt das Token als Bearer-Header an, sobald jemand angemeldet ist. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);
};

/** Lässt nur die Rolle admin durch; alle anderen landen auf /login mit Rücksprung-URL. */
export const adminGuard: CanMatchFn = (_route, segments) => {
  if (inject(AuthService).isAdmin()) return true;
  const returnUrl = '/' + segments.map((s) => s.path).join('/');
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl } });
};
