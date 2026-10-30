// Starter Lab 3.1: Session-Liste im alten Stil (*ngIf, *ngFor, ngSwitch).
// Aufgabe: Template auf @if, @for, @switch und @let umstellen (siehe Übung).
import { AsyncPipe, DatePipe, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, Pipe, PipeTransform, inject } from '@angular/core';
import { SessionApi } from '../shared/api';
import { Session } from '../shared/models';

// Reine Pipe (gegeben): filtert nach Suchbegriff und sortiert nach Titel.
// Sie rechnet nur neu, wenn sich die Liste oder ein Argument ändert.
@Pipe({ name: 'sessionSort' })
export class SessionSortPipe implements PipeTransform {
  transform(sessions: Session[], term: string, descending: boolean): Session[] {
    const needle = term.trim().toLowerCase();
    const result = sessions.filter((s) => s.title.toLowerCase().includes(needle));
    result.sort((a, b) => a.title.localeCompare(b.title, 'de'));
    return descending ? result.reverse() : result;
  }
}

@Component({
  selector: 'app-playground',
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe, SessionSortPipe],
  template: `
    <h1>Sessions</h1>
    <div class="row">
      <input #search placeholder="Suche im Titel" (input)="term = search.value" />
      <button class="btn" (click)="descending = !descending">Sortierung: {{ descending ? 'Z–A' : 'A–Z' }}</button>
    </div>

    <ng-container *ngIf="sessions$ | async as sessions; else loading">
      <p class="muted">{{ (sessions | sessionSort: term : descending).length }} von {{ sessions.length }} Sessions</p>

      <ng-container *ngIf="(sessions | sessionSort: term : descending).length > 0; else empty">
        <div class="card" *ngFor="let session of sessions | sessionSort: term : descending">
          <div class="row">
            <strong>{{ session.title }}</strong>
            <ng-container [ngSwitch]="session.level">
              <span *ngSwitchCase="'Einsteiger'" class="badge badge-ok">Einsteiger</span>
              <span *ngSwitchCase="'Fortgeschritten'" class="badge badge-warn">Fortgeschritten</span>
              <span *ngSwitchDefault class="badge badge-error">{{ session.level }}</span>
            </ng-container>
          </div>
          <p class="muted">
            {{ session.start | date: 'EEE, HH:mm' }} · {{ session.room }} ·
            {{ session.speaker?.name ?? 'Speaker folgt' }}
          </p>
          <input placeholder="Eigene Notiz zur Session" />
        </div>
      </ng-container>
    </ng-container>

    <ng-template #empty>
      <p class="muted">Keine Session passt zu „{{ term }}“.</p>
    </ng-template>
    <ng-template #loading>
      <p class="loading">Lade Sessions …</p>
    </ng-template>
  `,
})
export class Playground {
  private readonly api = inject(SessionApi);

  // Observable + async pipe: die Ansicht aktualisiert sich ohne Zone.js (Lab 1.1)
  readonly sessions$ = this.api.getSessions();

  // Einfache Felder, die nur durch Template-Events geändert werden
  term = '';
  descending = false;
}
