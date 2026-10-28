import { httpResource } from '@angular/common/http';
import { Component, Input, signal } from '@angular/core';
import { API_URL } from '../../../shared/api';
import { Session } from '../../../shared/models';

// Lab 6.2: Detail per httpResource. Die URL hängt von einem Signal ab;
// ändert sich die ID, startet automatisch eine neue Anfrage (alte wird abgebrochen).
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
      <p class="muted">
        {{ session.value().speaker?.name }} · {{ session.value().room }} · {{ session.value().level }}
      </p>
    }
  `,
})
export class SessionDetail {
  protected readonly sessionId = signal<number | undefined>(undefined);

  /** Klassischer Input mit Setter, der den Wert in ein Signal schreibt (Lab 6.3 ersetzt das durch input()). */
  @Input({ required: true })
  set id(value: string | number) {
    this.sessionId.set(Number(value));
  }

  // undefined als URL → keine Anfrage (Status 'idle')
  protected readonly session = httpResource<Session>(() => {
    const id = this.sessionId();
    return id ? `${API_URL}/sessions/${id}` : undefined;
  });
}
