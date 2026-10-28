// Lab 3.2: Session-Detailseite, Speaker-Profil und Kommentare per @defer nachgeladen.
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionApi } from '../../../shared/api';
import { SessionComments } from './session-comments';
import { SpeakerBio } from './speaker-bio';

@Component({
  selector: 'app-defer-example',
  // SpeakerBio und SessionComments stehen nur in @defer-Blöcken:
  // der Compiler ersetzt den Import durch ein dynamisches import() und baut je einen eigenen Chunk.
  imports: [AsyncPipe, DatePipe, SpeakerBio, SessionComments],
  template: `
    <div class="row">
      @for (id of sessionIds; track id) {
        <button class="btn" (click)="show(id)">Session {{ id }}</button>
      }
    </div>

    @if (session$ | async; as session) {
      <article class="card">
        <h1>{{ session.title }}</h1>
        <p class="muted">
          {{ session.start | date: 'EEEE, dd.MM.yyyy, HH:mm' }} · {{ session.durationMin }} min · {{ session.room }}
        </p>
        <p>{{ session.abstract }}</p>
        <p>Belegt: {{ session.booked }} von {{ session.capacity }} Plätzen</p>
      </article>

      <!-- Platzhalter für viel Inhalt: erst nach dem Scrollen erscheint der Speaker-Bereich -->
      <div class="card muted" style="min-height: 110vh">Agenda, Raumplan und Anfahrt … (weiter nach unten scrollen)</div>

      <h2>Speaker</h2>
      @defer (on viewport) {
        <app-speaker-bio [speaker]="session.speaker" />
      } @placeholder {
        <p class="muted">Das Speaker-Profil lädt, sobald dieser Bereich sichtbar wird.</p>
      } @loading (after 100ms; minimum 500ms) {
        <p class="loading">Lade Speaker-Profil …</p>
      } @error {
        <p class="error">Speaker-Profil konnte nicht geladen werden.</p>
      }

      <h2>Kommentare</h2>
      @defer (on interaction; prefetch on hover) {
        <app-session-comments [sessionId]="session.id" />
      } @placeholder {
        <button class="btn">Kommentare anzeigen</button>
      } @loading (minimum 500ms) {
        <p class="loading">Lade Kommentare …</p>
      }
    } @else {
      <p class="loading">Lade Session …</p>
    }
  `,
})
export class DeferExample {
  private readonly api = inject(SessionApi);

  readonly sessionIds = [1, 5, 9];

  // Observable-Feld; ein Klick setzt ein neues Observable, das async pipe abonniert
  session$ = this.api.getSession(1);

  show(id: number): void {
    this.session$ = this.api.getSession(id);
  }
}
