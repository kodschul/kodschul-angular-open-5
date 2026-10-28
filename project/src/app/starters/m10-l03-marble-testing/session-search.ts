import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import { Session } from '../../shared/models';

// Code unter Test: die Suchkette aus Lab 5.2, herausgelöst als reine Funktion.
// Eingaben (Suchbegriffe) und die Suche selbst kommen als Parameter herein,
// deshalb lässt sich die Funktion ohne Komponente, HttpClient und echte Zeit testen.

export type SearchFn = (term: string) => Observable<Session[]>;

export interface SearchState {
  term: string;
  sessions: Session[];
  error: string | null;
}

export function sessionSearch(
  terms$: Observable<string>,
  search: SearchFn,
  debounceMs = 300,
): Observable<SearchState> {
  return terms$.pipe(
    map((term) => term.trim()),
    debounceTime(debounceMs), // erst suchen, wenn 300 ms Ruhe ist
    distinctUntilChanged(), // gleicher Begriff → keine neue Anfrage
    switchMap((term) =>
      // neuer Begriff → alte Anfrage wird abbestellt
      search(term).pipe(
        map((sessions): SearchState => ({ term, sessions, error: null })),
        catchError(() => of<SearchState>({ term, sessions: [], error: 'Suche fehlgeschlagen' })),
      ),
    ),
  );
}
