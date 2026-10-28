import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { API_URL } from '../shared/api';
import { Session } from '../shared/models';

// Starter Lab 5.2: Inhalt nach src/app/playground/playground.ts kopieren.
// Die benötigten Operatoren sind schon importiert.

export type SessionSearchFn = (term: string, level: string) => Observable<Session[]>;

export interface SessionSearchResult {
  term: string;
  level: string;
  sessions: Session[];
  error: string | null;
}

/** Live-Suche als reine Funktion. */
export function createSessionSearch(
  term$: Observable<string>,
  level$: Observable<string>,
  search: SessionSearchFn,
): Observable<SessionSearchResult> {
  // TODO Aufgabe 2: bei jeder Änderung von Begriff oder Level search(q, level) mit beiden aktuellen Werten,
  //                 alle Anfragen parallel (mergeMap), Treffer als SessionSearchResult
  // TODO Aufgabe 4: mergeMap durch switchMap ersetzen
  // TODO Aufgabe 5: term$ mit map(trim), debounceTime(300), distinctUntilChanged vorbereiten
  // TODO Aufgabe 6: retry(1) und catchError im inneren Observable
  return of({ term: '', level: '', sessions: [], error: null });
}

@Component({
  selector: 'app-playground',
  imports: [ReactiveFormsModule, AsyncPipe],
  template: `
    <h1>Lab 5.2 Live-Suche</h1>

    <div class="row">
      <input [formControl]="searchControl" placeholder="Suchbegriff, z. B. angular" />
      <select [formControl]="levelControl">
        <option value="">Alle Level</option>
        <option>Einsteiger</option>
        <option>Fortgeschritten</option>
        <option>Experte</option>
      </select>
      <label class="row"><input type="checkbox" style="width: auto" (change)="toggleError($event)" /> API-Fehler simulieren</label>
    </div>

    @if (results$ | async; as result) {
      <p>
        Ergebnis für »{{ result.term }}« ({{ result.level || 'alle Level' }}):
        @if (result.term !== searchControl.value.trim()) {
          <span class="badge badge-warn">passt nicht zur Eingabe</span>
        }
      </p>
      @if (result.error) {
        <p class="error">{{ result.error }}</p>
      }
      @for (session of result.sessions; track session.id) {
        <div class="card">
          <strong>{{ session.title }}</strong>
          <span class="badge">{{ session.level }}</span>
        </div>
      } @empty {
        <p class="muted">Keine Sessions gefunden.</p>
      }
    }
  `,
})
export class Playground {
  private readonly http = inject(HttpClient);
  private simulateError = false;

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly levelControl = new FormControl('', { nonNullable: true });

  protected readonly results$ = createSessionSearch(
    this.searchControl.valueChanges.pipe(startWith('')),
    this.levelControl.valueChanges.pipe(startWith('')),
    (q, level) => this.search(q, level),
  );

  protected toggleError(event: Event): void {
    this.simulateError = (event.target as HTMLInputElement).checked;
  }

  /** Gegeben: GET /sessions mit Zufallsverzögerung (0–1500 ms), optional mit Fehler 500. */
  private search(q: string, level: string): Observable<Session[]> {
    const params: Record<string, string> = { _randomDelay: '1' };
    if (q) params['q'] = q;
    if (level) params['level'] = level;
    if (this.simulateError) params['_fail'] = '500';

    console.log(`→ Anfrage q="${q}" level="${level}"`);
    return this.http
      .get<Session[]>(`${API_URL}/sessions`, { params })
      .pipe(tap((sessions) => console.log(`← Antwort q="${q}": ${sessions.length} Treffer`)));
  }
}
