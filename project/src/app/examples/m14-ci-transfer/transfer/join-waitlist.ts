import { HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, exhaustMap, map, of } from 'rxjs';
import { waitlistApiEvents } from './waitlist.events';
import { WaitlistEntry, WaitlistRequest } from './waitlist.model';

/**
 * Wandelt Anfragen in API-Ereignisse um. exhaustMap (Lab 5.2): Solange eine Anfrage läuft,
 * werden weitere ignoriert – ein Doppelklick erzeugt keinen doppelten Eintrag.
 * Als eigene Funktion, damit sie sich mit Marble-Tests prüfen lässt (Lab 10.3).
 */
export function joinWaitlist(
  requests$: Observable<WaitlistRequest>,
  post: (request: WaitlistRequest) => Observable<WaitlistEntry>,
) {
  return requests$.pipe(
    exhaustMap((request) =>
      post(request).pipe(
        map((entry) => waitlistApiEvents.joined(entry)),
        catchError((error: HttpErrorResponse) =>
          of(waitlistApiEvents.joinFailed(`Eintrag fehlgeschlagen (HTTP ${error.status})`)),
        ),
      ),
    ),
  );
}
