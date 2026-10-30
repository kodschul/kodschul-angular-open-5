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

    <!-- Vorbereitet: Die Blöcke unten sind auskommentiert, weil store.load() & Co. noch fehlen.
         Jeweils in der genannten Aufgabe die Kommentarzeichen entfernen. -->

    <!-- Aufgabe 3 einkommentieren:
    <div class="row">
      <button class="btn" (click)="store.load()">Neu laden</button>
    </div>
    @if (store.loading()) {
      <p class="loading">Lade Sessions …</p>
    }
    @if (store.error(); as message) {
      <div class="card">
        <p class="error">{{ message }}</p>
        <button class="btn" (click)="store.load()">Erneut versuchen</button>
      </div>
    }
    @for (favorite of store.favoriteSessions(); track favorite.id) {
      <span class="badge badge-ok">{{ favorite.title }}</span>
    }
    -->

    <!-- Aufgabe 5 einkommentieren:
    <div class="row">
      <button class="btn btn-primary" [disabled]="store.favoriteCount() === 0" (click)="store.saveFavorites()">
        Favoriten speichern ({{ store.favoriteCount() }})
      </button>
      @if (store.saving()) {
        <span class="loading">Speichere …</span>
      } @else if (store.savedCount() !== null) {
        <span class="badge badge-ok">{{ store.savedCount() }} Favoriten gespeichert</span>
      }
    </div>
    -->

    <!-- Aufgabe 3: [sessions]="store.entities()"; Aufgabe 4: (favoriteToggled) an store.toggleFavorite binden -->
    <app-m07-session-list [sessions]="[]" [favoriteIds]="store.favoriteIds()" />
  `,
})
export class Playground {
  readonly store = inject(SessionsStore);
}
