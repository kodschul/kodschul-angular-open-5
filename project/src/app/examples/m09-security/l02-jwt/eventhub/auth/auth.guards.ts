import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LOGIN_URL } from './login-url';

/** CanActivateFn: Route ist bekannt und geladen; Zugriff nur mit Login. */
export const loggedInGuard: CanActivateFn = (_route, state) => {
  if (inject(AuthService).isLoggedIn()) return true;
  return inject(Router).createUrlTree([inject(LOGIN_URL)], { queryParams: { returnUrl: state.url } });
};

/** CanMatchFn: Ohne Rolle "admin" passt die Route nicht – ihr Code wird gar nicht erst geladen. */
export const adminMatchGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  if (auth.isLoggedIn()) return false; // angemeldet, aber keine Admin-Rolle: nächste Route mit gleichem Pfad
  const returnUrl = router.currentNavigation()?.initialUrl.toString() ?? '/';
  return router.createUrlTree([inject(LOGIN_URL)], { queryParams: { returnUrl } });
};
