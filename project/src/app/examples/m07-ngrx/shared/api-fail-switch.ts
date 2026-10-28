// Modul 7: Schalter für den Fehlerfall der Mock-API (POST /_control, siehe api/server.mjs).
// Ist der Schalter an, antwortet jede API-Anfrage mit HTTP 500.
// Beim Verlassen der Seite wird der Schalter zurückgesetzt, damit andere Labs normal laufen.
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { API_URL } from '../../../shared/api';

interface ApiControl {
  delay: number;
  randomDelay: boolean;
  fail: number;
}

@Component({
  selector: 'app-api-fail-switch',
  template: `
    <label class="row muted">
      <input type="checkbox" [checked]="failing()" (change)="toggle(box.checked)" #box />
      API-Fehler simulieren (alle Anfragen liefern 500)
    </label>
    @if (unreachable()) {
      <p class="muted">Schalter nicht verfügbar: Mock-API nicht erreichbar (läuft <code>npm run api</code>?).</p>
    }
  `,
})
export class ApiFailSwitch {
  private readonly http = inject(HttpClient);
  readonly failing = signal(false);
  readonly unreachable = signal(false);

  constructor() {
    // aktuellen Schalterstand der Mock-API anzeigen; ohne laufende API nur einen Hinweis zeigen
    this.http.get<ApiControl>(`${API_URL}/_control`).subscribe({
      next: (control) => this.show(control),
      error: () => this.unreachable.set(true),
    });
    inject(DestroyRef).onDestroy(() =>
      this.http.post(`${API_URL}/_control`, { fail: 0 }).subscribe({ error: () => undefined }),
    );
  }

  toggle(fail: boolean): void {
    this.http.post<ApiControl>(`${API_URL}/_control`, { fail: fail ? 500 : 0 }).subscribe({
      next: (control) => this.show(control),
      error: () => {
        this.unreachable.set(true);
        this.failing.set(false);
      },
    });
  }

  private show(control: ApiControl): void {
    this.unreachable.set(false);
    this.failing.set(control.fail >= 400);
  }
}
