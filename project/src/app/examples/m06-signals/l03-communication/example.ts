import { Component, ElementRef, computed, inject, signal, viewChild, viewChildren } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SessionApi } from '../../../shared/api';
import { FavoritesHeader } from './favorites-header';
import { FavoritesService } from './favorites.service';
import { SessionCard } from './session-card';

// Lab 6.3: Seite mit Header (liest den Service) und Karten (input, output, model).
@Component({
  selector: 'app-communication-example',
  imports: [FavoritesHeader, SessionCard],
  template: `
    <h1>Lab 6.3 Komponenten-Kommunikation mit Signals</h1>
    <app-favorites-header />

    <div class="row">
      <input #filterBox placeholder="Titel filtern" (input)="filter.set(filterBox.value)" />
      <button class="btn" (click)="focusFilter()">Filter fokussieren</button>
      <span class="muted">{{ cardCount() }} Karten angezeigt</span>
    </div>
    @if (selectedTitle()) {
      <p>Zuletzt gewählt: {{ selectedTitle() }}</p>
    }

    <div class="grid" style="margin-top: 1rem">
      @for (session of visibleSessions(); track session.id) {
        <app-session-card
          compact
          [session]="session"
          [favorite]="favorites.isFavorite(session.id)"
          (favoriteChange)="favorites.setFavorite(session.id, $event)"
          (selected)="selectedTitle.set($event.title)"
        />
      }
    </div>
  `,
})
export class CommunicationExample {
  protected readonly favorites = inject(FavoritesService);
  private readonly sessions = toSignal(inject(SessionApi).getSessions(), { initialValue: [] });

  protected readonly filter = signal('');
  protected readonly selectedTitle = signal<string | null>(null);
  protected readonly visibleSessions = computed(() =>
    this.sessions().filter((s) => s.title.toLowerCase().includes(this.filter().toLowerCase())),
  );

  // Signal-Queries: Ergebnis ist ein Signal und aktualisiert sich mit dem Template
  private readonly filterBox = viewChild.required<ElementRef<HTMLInputElement>>('filterBox');
  private readonly cards = viewChildren(SessionCard);
  protected readonly cardCount = computed(() => this.cards().length);

  protected focusFilter(): void {
    this.filterBox().nativeElement.focus();
  }
}
