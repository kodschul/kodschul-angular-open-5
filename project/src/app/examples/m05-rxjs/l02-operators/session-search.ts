import {
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  mergeMap,
  of,
  retry,
  switchMap,
} from 'rxjs';
import { Session } from '../../../shared/models';

/** Führt eine Suche aus, z. B. GET /sessions?q=…&level=… */
export type SessionSearchFn = (term: string, level: string) => Observable<Session[]>;

/** Ergebnis einer Suche: für welchen Begriff und welches Level es gilt, plus Treffer oder Fehlermeldung. */
export interface SessionSearchResult {
  term: string;
  level: string;
  sessions: Session[];
  error: string | null;
}

export interface SessionSearchOptions {
  /** Ruhezeit nach dem letzten Tastendruck, Standard 300 ms. */
  debounceMs?: number;
  /** 'switch' (Standard): alte Anfragen abbrechen. 'merge': alle parallel laufen lassen (Race Condition). */
  flatten?: 'switch' | 'merge';
  /** Anzahl Wiederholungen bei Fehler, Standard 1. */
  retryCount?: number;
}

/**
 * Live-Suche als reine Funktion: kennt weder Angular noch HttpClient.
 * term$  – Suchbegriff bei jeder Eingabe
 * level$ – gewähltes Level ('' = alle)
 * search – Funktion, die die eigentliche Anfrage ausführt
 */
export function createSessionSearch(
  term$: Observable<string>,
  level$: Observable<string>,
  search: SessionSearchFn,
  options: SessionSearchOptions = {},
): Observable<SessionSearchResult> {
  const { debounceMs = 300, flatten = 'switch', retryCount = 1 } = options;

  const term = term$.pipe(
    map((value) => value.trim()),
    debounceTime(debounceMs), // erst nach einer Tipp-Pause suchen
    distinctUntilChanged(), // gleicher Begriff → keine neue Anfrage
  );
  const level = level$.pipe(distinctUntilChanged());

  // Pro Kombination aus Begriff und Level ein inneres Observable (die HTTP-Anfrage)
  const request = ([q, lvl]: [string, string]) =>
    search(q, lvl).pipe(
      retry(retryCount), // fehlgeschlagene Anfrage einmal wiederholen
      map((sessions): SessionSearchResult => ({ term: q, level: lvl, sessions, error: null })),
      // Fehler hier abfangen, sonst endet der äußere Strom und die Suche ist tot
      catchError(() => of<SessionSearchResult>({ term: q, level: lvl, sessions: [], error: 'Suche fehlgeschlagen' })),
    );

  const both = combineLatest([term, level]);
  return flatten === 'merge' ? both.pipe(mergeMap(request)) : both.pipe(switchMap(request));
}
