import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { sessionsFeature } from './sessions.feature';

// Kleine Komponente, die nur einen Selector liest: Test mit provideMockStore.
@Component({
  selector: 'app-favorites-badge',
  template: `<span class="badge" data-cy="favorites-count">★ {{ count() }}</span>`,
})
export class FavoritesBadge {
  protected readonly count = inject(Store).selectSignal(sessionsFeature.selectFavoriteCount);
}
