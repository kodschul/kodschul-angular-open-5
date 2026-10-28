// Starter Lab 7.4: Gleiche Oberfläche wie Lab 7.3, Zustand aus einem Signal Store.
// Kopieren nach src/app/playground/playground.ts; Ordner m07-l04-signal-store/ nach src/app/playground/m07-l04-signal-store/.
import { Component, inject } from '@angular/core';
import { ApiFailSwitch } from '../examples/m07-ngrx/shared/api-fail-switch';
import { SessionList } from '../examples/m07-ngrx/shared/session-list';
import { SessionsStore } from './m07-l04-signal-store/sessions.store';

@Component({
  selector: 'app-playground',
  imports: [SessionList, ApiFailSwitch],
  // Store-Instanz lebt so lange wie diese Seite
  providers: [SessionsStore],
  template: `
    <h1>Sessions (NgRx Signal Store)</h1>
    <app-api-fail-switch />

    <!-- Aufgabe 2: Anzahl der Favoriten aus store.favoriteCount() anzeigen -->
    <p class="muted">Ladezustand: {{ store.loading() }} · Favoriten-IDs: {{ store.favoriteIds() }}</p>

    <!-- Aufgabe 3: Buttons „Neu laden“, Lade- und Fehleranzeige wie in Lab 7.3 ergänzen -->
    <!-- Aufgabe 5: Button „Favoriten speichern“ mit Speicheranzeige ergänzen -->

    <!-- Aufgabe 3: [sessions]="store.entities()"; Aufgabe 4: (favoriteToggled) an store.toggleFavorite binden -->
    <app-m07-session-list [sessions]="[]" [favoriteIds]="store.favoriteIds()" />
  `,
})
export class Playground {
  readonly store = inject(SessionsStore);
}
