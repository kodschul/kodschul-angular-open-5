// Lab 3.1: Session-Liste mit Control Flow (@if, @for + track + @empty, @switch, @let).
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SessionApi } from '../../../shared/api';
import { SessionSortPipe } from './session-sort.pipe';

@Component({
  selector: 'app-control-flow-example',
  // Kein NgIf/NgFor/NgSwitch mehr: Control Flow ist in die Template-Syntax eingebaut
  imports: [AsyncPipe, DatePipe, SessionSortPipe],
  template: `
    <h1>Sessions</h1>
    <div class="row">
      <input #search placeholder="Suche im Titel" (input)="term = search.value" />
      <button class="btn" (click)="descending = !descending">Sortierung: {{ descending ? 'Z–A' : 'A–Z' }}</button>
    </div>

    @if (sessions$ | async; as sessions) {
      <!-- @let rechnet die gefilterte Liste einmal und gibt ihr einen Namen -->
      @let visible = sessions | sessionSort: term : descending;
      <p class="muted">{{ visible.length }} von {{ sessions.length }} Sessions</p>

      @for (session of visible; track session.id) {
        <div class="card">
          <div class="row">
            <strong>{{ session.title }}</strong>
            @switch (session.level) {
              @case ('Einsteiger') {
                <span class="badge badge-ok">Einsteiger</span>
              }
              @case ('Fortgeschritten') {
                <span class="badge badge-warn">Fortgeschritten</span>
              }
              @default {
                <span class="badge badge-error">{{ session.level }}</span>
              }
            }
          </div>
          <p class="muted">
            {{ session.start | date: 'EEE, HH:mm' }} · {{ session.room }} ·
            {{ session.speaker?.name ?? 'Speaker folgt' }}
          </p>
          <input placeholder="Eigene Notiz zur Session" />
        </div>
      } @empty {
        <p class="muted">Keine Session passt zu „{{ term }}“.</p>
      }
    } @else {
      <p class="loading">Lade Sessions …</p>
    }
  `,
})
export class ControlFlowExample {
  private readonly api = inject(SessionApi);

  // Observable + async pipe: die Ansicht aktualisiert sich ohne Zone.js (Lab 2.2)
  readonly sessions$ = this.api.getSessions();

  // Einfache Felder, die nur durch Template-Events geändert werden
  term = '';
  descending = false;
}
