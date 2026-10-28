// Starter Lab 1.1: Inhalt nach src/app/playground/playground.ts kopieren.
// TODO 0: AsyncPipe aus '@angular/common' importieren und in imports eintragen
import { Component, VERSION, inject } from '@angular/core';
import { SessionApi } from '../shared/api';

@Component({
  selector: 'app-playground',
  imports: [],
  template: `
    <h1>Playground</h1>
    <p class="muted">Angular {{ version }}</p>

    <!-- TODO 1: sessions$ mit der async-Pipe auflösen und in einer @if-Klammer als "sessions" benennen -->
    <!-- TODO 2: mit @for (… ; track session.id) für jede Session eine .card mit Titel und Raum ausgeben -->
    <!-- TODO 3: im @else-Zweig "Lade Sessions …" anzeigen -->
  `,
})
export class Playground {
  // inject() holt den Service aus der Dependency Injection (Lab 1.2 erklärt es)
  private readonly api = inject(SessionApi);

  protected readonly version = VERSION.full;
  protected readonly sessions$ = this.api.getSessions();
}
