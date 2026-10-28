import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, tap } from 'rxjs';
import { API_URL } from '../../../shared/api';
import { Session } from '../../../shared/models';
import { SessionSearchResult, createSessionSearch } from './session-search';

// Lab 5.2: Live-Suche mit Level-Filter.
// /examples/m05-rxjs/l02-operators       → switchMap (korrekt)
// /examples/m05-rxjs/l02-operators/ohne  → mergeMap ohne debounceTime (Race Condition sichtbar)
@Component({
  selector: 'app-operators-example',
  imports: [ReactiveFormsModule, AsyncPipe],
  template: `
    <h1>Lab 5.2 Live-Suche {{ flatten === 'merge' ? 'mit mergeMap (Fehlerbild)' : 'mit switchMap' }}</h1>

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
export class OperatorsExample implements OnInit {
  /** Kommt aus den Routen-Daten (withComponentInputBinding). */
  @Input() flatten: 'switch' | 'merge' = 'switch';
  /** Kommt aus den Routen-Daten; /ohne setzt 0, damit jeder Tastendruck eine Anfrage startet. */
  @Input() debounceMs = 300;

  private readonly http = inject(HttpClient);
  private simulateError = false;

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly levelControl = new FormControl('', { nonNullable: true });
  protected results$!: Observable<SessionSearchResult>;

  ngOnInit(): void {
    this.results$ = createSessionSearch(
      // valueChanges sendet erst bei der ersten Eingabe; startWith liefert den Anfangswert
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
      this.levelControl.valueChanges.pipe(startWith(this.levelControl.value)),
      (q, level) => this.search(q, level),
      { flatten: this.flatten, debounceMs: this.debounceMs },
    );
  }

  protected toggleError(event: Event): void {
    this.simulateError = (event.target as HTMLInputElement).checked;
  }

  /** GET /sessions mit Zufallsverzögerung (0–1500 ms), optional mit simuliertem Fehler 500. */
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
