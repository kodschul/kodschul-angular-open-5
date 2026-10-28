import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SessionApi } from '../../../shared/api';
import { Session } from '../../../shared/models';

// Code unter Test für Lab 10.1: drei kleine Bausteine mit je einer Abhängigkeit,
// die im Test durch einen Spy ersetzt wird.

/** Auslastung in Prozent (gerundet). Reine Funktion, braucht keinen Spy. */
export function bookingRate(session: Session): number {
  return session.capacity === 0 ? 100 : Math.round((session.booked / session.capacity) * 100);
}

/** Ruft `notify` auf, wenn eine Session zu mindestens 90 % gebucht ist. */
export function warnIfAlmostFull(session: Session, notify: (message: string) => void): boolean {
  const rate = bookingRate(session);
  if (rate < 90) return false;
  notify(`${session.title}: ${rate} % gebucht`);
  return true;
}

/** Schreibt für jede ausgebuchte Session eine Warnung in die Konsole und liefert deren Anzahl. */
export function logSoldOut(sessions: Session[]): number {
  const soldOut = sessions.filter((s) => s.booked >= s.capacity);
  soldOut.forEach((s) => console.warn(`Ausgebucht: ${s.title}`));
  return soldOut.length;
}

/** Service mit HTTP-Abhängigkeit: zählt Workshops über die Mock-API. */
@Injectable({ providedIn: 'root' })
export class WorkshopStats {
  private readonly api = inject(SessionApi);

  countWorkshops(): Observable<number> {
    return this.api.getSessions({ type: 'workshop' }).pipe(map((sessions) => sessions.length));
  }
}
