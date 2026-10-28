import { Injectable } from '@angular/core';

/** Merkt sich favorisierte Session-IDs im Speicher (ohne Server). */
@Injectable({ providedIn: 'root' }) // Fix 4: ohne providedIn gibt es keinen Provider
export class FavoritesService {
  private readonly ids = new Set<number>();

  toggle(id: number): void {
    if (this.ids.has(id)) {
      this.ids.delete(id);
    } else {
      this.ids.add(id);
    }
  }

  has(id: number): boolean {
    return this.ids.has(id);
  }

  get count(): number {
    return this.ids.size;
  }
}
