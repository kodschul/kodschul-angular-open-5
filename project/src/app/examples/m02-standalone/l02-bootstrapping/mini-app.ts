import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Session } from '../../../shared/models';
import { EventHubConfigService } from './eventhub-config';

/** Root-Komponente der Mini-App. Läuft erst, wenn die Konfiguration geladen ist. */
@Component({
  selector: 'eventhub-mini-app',
  imports: [AsyncPipe, DatePipe],
  template: `
    <div class="card">
      <h2>EventHub Mini-App</h2>
      <ul>
        <li>API-URL aus config.json: <code>{{ config.apiUrl }}</code></li>
        <li>Feature „Kommentare“: {{ config.featureFlags.comments ? 'an' : 'aus' }}</li>
        <li>Konfiguration geladen: {{ loadedAt | date: 'HH:mm:ss.SSS' }}</li>
        <li>Root-Komponente erzeugt: {{ createdAt | date: 'HH:mm:ss.SSS' }}</li>
      </ul>
      @if (sessions$ | async; as sessions) {
        <p>{{ sessions.length }} Sessions von {{ config.apiUrl }} geladen.</p>
      } @else {
        <p class="loading">Lade Sessions …</p>
      }
    </div>
  `,
})
export class MiniApp {
  private readonly http = inject(HttpClient);
  private readonly configService = inject(EventHubConfigService);

  // Beim Erzeugen steht die Konfiguration schon fest: normales Feld genügt
  protected readonly config = this.configService.config;
  protected readonly loadedAt = this.configService.loadedAt;
  protected readonly createdAt = new Date();

  // Asynchrone Daten weiter über die async-Pipe (zoneless)
  protected readonly sessions$ = this.http.get<Session[]>(`${this.config.apiUrl}/sessions`);
}
