import { Component, inject } from '@angular/core';
import { FavoritesService } from './favorites.service';

// Liest den Zähler direkt aus dem Service: keine Inputs, keine Event-Kette.
@Component({
  selector: 'app-favorites-header',
  template: `
    <header class="card row">
      <strong>EventHub</strong>
      <span class="badge badge-ok">★ {{ favorites.count() }} Favoriten</span>
    </header>
  `,
})
export class FavoritesHeader {
  protected readonly favorites = inject(FavoritesService);
}
