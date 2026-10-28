// Modul 7: Speichern der Favoriten ohne Login.
// PUT /favorites der Mock-API verlangt ein Token (Login kommt erst in Modul 9).
// Dieser Service speichert deshalb im localStorage und verhält sich wie ein HTTP-Aufruf:
// Er liefert ein Observable und antwortet verzögert (800 ms).
import { Injectable } from '@angular/core';
import { Observable, defer, delay, of } from 'rxjs';

const STORAGE_KEY = 'eventhub.favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesStorage {
  /** Gespeicherte Favoriten lesen (leere Liste, wenn noch nichts gespeichert ist). */
  load(): Observable<number[]> {
    return defer(() => of(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as number[])).pipe(delay(300));
  }

  /** Favoriten speichern; das Observable liefert die gespeicherte Liste zurück. */
  save(favoriteIds: number[]): Observable<number[]> {
    return defer(() => {
      // läuft erst beim subscribe, also nur für Anfragen, die der Operator wirklich startet
      console.info('[FavoritesStorage] speichere', favoriteIds);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
      return of(favoriteIds);
    }).pipe(delay(800));
  }
}
