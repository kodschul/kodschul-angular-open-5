// Starter Lab 3.2: Session-Detailseite, alles wird sofort geladen.
// Vorher den Ordner src/app/starters/m03-l02-defer/ nach src/app/playground/m03-l02-defer/ kopieren.
// Aufgabe: Speaker-Profil und Kommentare mit @defer verzögert laden (siehe Übung).
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionApi } from '../shared/api';
import { SessionComments } from './m03-l02-defer/session-comments';
import { SpeakerBio } from './m03-l02-defer/speaker-bio';

@Component({
  selector: 'app-playground',
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
      <app-speaker-bio [speaker]="session.speaker" />

      <h2>Kommentare</h2>
      <app-session-comments [sessionId]="session.id" />
    } @else {
      <p class="loading">Lade Session …</p>
    }
  `,
})
export class Playground {
  private readonly api = inject(SessionApi);

  readonly sessionIds = [1, 5, 9];

  // Observable-Feld; ein Klick setzt ein neues Observable, das async pipe abonniert
  session$ = this.api.getSession(1);

  show(id: number): void {
    this.session$ = this.api.getSession(id);
  }
}
