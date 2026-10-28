// Lab 1.1: erste Komponente im Kurs-Workspace – Session-Liste aus der Mock-API.
import { AsyncPipe } from '@angular/common';
import { Component, VERSION, inject } from '@angular/core';
import { SessionApi } from '../../../shared/api';

@Component({
  selector: 'app-workspace-example',
  imports: [AsyncPipe],
  template: `
    <h1>Kurs-Workspace läuft</h1>
    <p class="muted">Angular {{ version }} · Mock-API auf http://localhost:3000</p>

    <!-- async-Pipe: abonniert das Observable und aktualisiert die Ansicht bei jedem neuen Wert -->
    @if (sessions$ | async; as sessions) {
      <p>{{ sessions.length }} Sessions geladen</p>
      <div class="grid">
        @for (session of sessions; track session.id) {
          <div class="card">
            <strong>{{ session.title }}</strong>
            <p class="muted">{{ session.room }}</p>
          </div>
        }
      </div>
    } @else {
      <p class="loading">Lade Sessions …</p>
    }
  `,
})
export class WorkspaceExample {
  private readonly api = inject(SessionApi);

  protected readonly version = VERSION.full;
  protected readonly sessions$ = this.api.getSessions();
}
