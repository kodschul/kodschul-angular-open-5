import { httpResource } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventHubConfigService } from '../config';
import { Session } from '../session';

// Detailseite für Deep-Links wie /sessions/3 (wichtig für den Container in Lab 13.3).
@Component({
  selector: 'app-session-detail',
  imports: [RouterLink],
  template: `
    <p><a routerLink="/">← Programm</a></p>
    @if (session.hasValue()) {
      <article class="card">
        <h1>{{ session.value().title }}</h1>
        <p class="muted">{{ session.value().track }} · {{ session.value().level }} · {{ session.value().room }}</p>
        <p>{{ session.value().abstract }}</p>
        @if (session.value().speaker; as speaker) {
          <p><strong>{{ speaker.name }}</strong>, {{ speaker.company }}</p>
        }
      </article>
    } @else if (session.error()) {
      <p class="error">Session {{ id() }} konnte nicht geladen werden.</p>
    } @else {
      <p class="loading">Session wird geladen …</p>
    }
  `,
})
export class SessionDetail {
  private readonly config = inject(EventHubConfigService).config;

  /** Routen-Parameter :id, gebunden über withComponentInputBinding (Lab 2.2). */
  readonly id = input.required<string>();
  readonly session = httpResource<Session>(() => `${this.config.apiUrl}/sessions/${this.id()}`);
}
