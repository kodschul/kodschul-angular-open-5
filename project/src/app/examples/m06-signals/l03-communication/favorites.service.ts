import { Injectable, computed, signal } from '@angular/core';

/** Geteilter Zustand für Favoriten: ein Service mit Signals, kein Store-Framework. */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  // Schreibzugriff nur im Service
  private readonly ids = signal<number[]>([]);

  /** Nur lesbar nach außen. */
  readonly favoriteIds = this.ids.asReadonly();
  readonly count = computed(() => this.ids().length);

  isFavorite(id: number): boolean {
    return this.ids().includes(id);
  }

  setFavorite(id: number, on: boolean): void {
    this.ids.update((ids) => (on ? (ids.includes(id) ? ids : [...ids, id]) : ids.filter((x) => x !== id)));
  }
}
