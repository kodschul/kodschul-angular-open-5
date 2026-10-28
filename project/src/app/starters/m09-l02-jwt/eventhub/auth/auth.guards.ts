import { inject } from '@angular/core'; // Imports für TODO 6 bereits vorhanden
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LOGIN_URL } from './login-url';

/** Konto-Seite: nur mit Login. */
export const loggedInGuard: CanActivateFn = (_route, state) => {
  // TODO 6a: angemeldet -> true, sonst UrlTree zu inject(LOGIN_URL) mit returnUrl = state.url
  return true;
};

/** Admin-Bereich: nur mit Rolle admin. */
export const adminMatchGuard: CanMatchFn = () => {
  // TODO 6b: Admin -> true, angemeldet ohne Admin-Rolle -> false,
  //          nicht angemeldet -> UrlTree zum Login, returnUrl aus router.currentNavigation()?.initialUrl
  return true;
};
