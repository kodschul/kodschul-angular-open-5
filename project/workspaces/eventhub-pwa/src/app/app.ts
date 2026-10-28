import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';

interface ProgramItem {
  id: number;
  title: string;
  room: string;
  start: string;
  speaker?: { name: string } | null;
}

/** Konferenzprogramm: soll in Lab 12.3 auch ohne Netz verfügbar sein. */
@Component({
  selector: 'app-root',
  imports: [DatePipe],
  template: `
    <main class="container">
      <h1>EventHub Programm</h1>
      @if (program.isLoading()) {
        <p class="loading">Lade Programm …</p>
      } @else if (program.error()) {
        <p class="muted">Programm nicht erreichbar. Läuft <code>npm run api</code> im Kursprojekt?</p>
      } @else {
        <ul>
          @for (item of program.value(); track item.id) {
            <li>
              <strong>{{ item.start | date: 'dd.MM. HH:mm' }}</strong> · {{ item.title }}
              <span class="muted">({{ item.room }}, {{ item.speaker?.name }})</span>
            </li>
          }
        </ul>
      }
    </main>
  `,
})
export class App {
  protected readonly program = httpResource<ProgramItem[]>(() => 'http://localhost:3000/sessions', { defaultValue: [] });
}
