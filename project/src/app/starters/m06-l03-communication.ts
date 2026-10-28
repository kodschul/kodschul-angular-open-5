import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  Output,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SessionApi } from '../shared/api';
import { Session } from '../shared/models';

// Starter Lab 6.3: Inhalt nach src/app/playground/playground.ts kopieren.
// Ausgangslage: Karte mit @Input/@Output, Favoriten-Service mit normalem Array.
// Fehlerbild: Der Zähler im Header bleibt bei 0, obwohl Karten als Favorit markiert werden.

// ---------- Service ----------
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  // TODO Aufgabe 4: durch signal<number[]>([]) ersetzen, count als computed
  private ids: number[] = [];

  get count(): number {
    return this.ids.length;
  }

  isFavorite(id: number): boolean {
    return this.ids.includes(id);
  }

  setFavorite(id: number, on: boolean): void {
    this.ids = on ? (this.ids.includes(id) ? this.ids : [...this.ids, id]) : this.ids.filter((x) => x !== id);
  }
}

// ---------- Header ----------
@Component({
  selector: 'app-favorites-header',
  template: `
    <header class="card row">
      <strong>EventHub</strong>
      <!-- TODO Aufgabe 4: count() als Signal lesen -->
      <span class="badge badge-ok">★ {{ favorites.count }} Favoriten</span>
    </header>
  `,
})
export class FavoritesHeader {
  protected readonly favorites = inject(FavoritesService);
}

// ---------- Karte (klassisch, wie in Lab 1.2) ----------
// TODO Aufgabe 2: @Input/@Output durch input.required, input mit transform, output ersetzen
// TODO Aufgabe 3: favorite + favoriteChange durch model(false) ersetzen
@Component({
  selector: 'app-session-card',
  template: `
    <article class="card">
      <div class="row">
        <strong>{{ session.title }}</strong>
        <button class="btn" (click)="toggleFavorite()" [attr.aria-pressed]="favorite">
          {{ favorite ? '★ Favorit' : '☆ Merken' }}
        </button>
      </div>
      @if (!compact) {
        <p>{{ session.abstract }}</p>
      }
      <p class="muted">{{ session.level }} · noch {{ session.capacity - session.booked }} Plätze</p>
      <button class="btn" (click)="selected.emit(session)">Details</button>
    </article>
  `,
})
export class SessionCard {
  @Input({ required: true }) session!: Session;
  @Input({ transform: booleanAttribute }) compact = false;
  @Input() favorite = false;
  @Output() favoriteChange = new EventEmitter<boolean>();
  @Output() selected = new EventEmitter<Session>();

  protected toggleFavorite(): void {
    this.favorite = !this.favorite;
    this.favoriteChange.emit(this.favorite);
  }
}

// ---------- Seite ----------
@Component({
  selector: 'app-playground',
  imports: [FavoritesHeader, SessionCard],
  template: `
    <h1>Lab 6.3 Komponenten-Kommunikation</h1>
    <app-favorites-header />

    @if (selectedTitle()) {
      <p>Zuletzt gewählt: {{ selectedTitle() }}</p>
    }

    <div class="grid" style="margin-top: 1rem">
      @for (session of sessions(); track session.id) {
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
export class Playground {
  protected readonly favorites = inject(FavoritesService);
  protected readonly sessions = toSignal(inject(SessionApi).getSessions(), { initialValue: [] });
  protected readonly selectedTitle = signal<string | null>(null);
}
