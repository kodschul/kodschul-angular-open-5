import { httpResource } from '@angular/common/http';
import { Component, Input, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { API_URL, SessionApi } from '../shared/api';
import { Session } from '../shared/models';
import { SessionSearchResult, createSessionSearch } from '../examples/m05-rxjs/l02-operators/session-search';

// Starter Lab 6.2: Inhalt nach src/app/playground/playground.ts kopieren.
// Zwei Komponenten in einer Datei: SessionDetail (httpResource) und Playground (Suche per toSignal).

@Component({
  selector: 'app-session-detail',
  template: `
    @if (session.isLoading()) {
      <p class="loading">Lade Session {{ sessionId() }} …</p>
    } @else if (session.error()) {
      <p class="error">Fehler {{ session.statusCode() ?? '' }}: Session {{ sessionId() }} nicht geladen.</p>
      <button class="btn" (click)="session.reload()">Erneut versuchen</button>
    } @else if (session.hasValue()) {
      <h2>{{ session.value().title }}</h2>
      <p>{{ session.value().abstract }}</p>
      <p class="muted">{{ session.value().speaker?.name }} · {{ session.value().room }} · {{ session.value().level }}</p>
    } @else {
      <p class="muted">Noch nichts geladen.</p>
    }
  `,
})
export class SessionDetail {
  protected readonly sessionId = signal<number | undefined>(undefined);

  @Input({ required: true })
  set id(value: string | number) {
    this.sessionId.set(Number(value));
  }

  // TODO Aufgabe 2: URL aus sessionId() bilden: `${API_URL}/sessions/${id}`, ohne ID undefined
  protected readonly session = httpResource<Session>(() => undefined);
}

@Component({
  selector: 'app-playground',
  imports: [RouterLink, SessionDetail],
  template: `
    <h1>Lab 6.2 Suche und Detail ohne subscribe</h1>
    <div class="row">
      <input placeholder="Suchbegriff" [value]="term()" (input)="term.set($any($event.target).value)" />
      <select (change)="level.set($any($event.target).value)">
        <option value="">Alle Level</option>
        <option>Einsteiger</option>
        <option>Fortgeschritten</option>
        <option>Experte</option>
      </select>
    </div>

    <div class="grid" style="margin-top: 1rem">
      <section>
        @if (result(); as r) {
          @if (r.error) {
            <p class="error">{{ r.error }}</p>
          }
          @for (session of r.sessions; track session.id) {
            <a class="card" style="display: block" [routerLink]="[]" [queryParams]="{ id: session.id }">
              {{ session.title }}
            </a>
          } @empty {
            <p class="muted">Keine Treffer.</p>
          }
        } @else {
          <p class="loading">Suche läuft …</p>
        }
      </section>

      <section class="card">
        @if (id) {
          <app-session-detail [id]="id" />
        } @else {
          <p class="muted">Session links auswählen.</p>
        }
      </section>
    </div>
  `,
})
export class Playground {
  /** Query-Parameter ?id=… (Router-Input dank withComponentInputBinding). */
  @Input() id?: string;

  private readonly api = inject(SessionApi);
  protected readonly term = signal('');
  protected readonly level = signal('');

  // TODO Aufgabe 4: term und level per toObservable in createSessionSearch geben,
  //                 Suchfunktion: (q, level) => this.api.getSessions({ q, level }),
  //                 Ergebnis per toSignal mit initialValue null
  protected readonly result = toSignal(of<SessionSearchResult | null>(null), { initialValue: null });
}
