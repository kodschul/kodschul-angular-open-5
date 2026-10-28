import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { API_URL } from '../../../shared/api';
import { Session } from '../../../shared/models';

/** Funktionaler Guard (Lab 9.2): Warteliste nur für ausgebuchte Sessions, sonst zurück zur Info-Seite. */
export const sessionFullGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const fallback = router.createUrlTree(['/examples/m14-ci-transfer/transfer']);
  return inject(HttpClient)
    .get<Session>(`${API_URL}/sessions/${route.paramMap.get('sessionId')}`)
    .pipe(
      map((session) => (session.booked >= session.capacity ? true : fallback)),
      catchError(() => of(fallback)),
    );
};
