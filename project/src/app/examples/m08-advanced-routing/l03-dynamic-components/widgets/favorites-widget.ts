import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SessionApi } from '../../../../shared/api';

@Component({
  selector: 'app-favorites-widget',
  template: `
    <h3>Favoriten ({{ favorites().length }})</h3>
    <ul>
      @for (s of favorites(); track s.id) {
        <li>{{ s.title }}</li>
      } @empty {
        <li class="muted">Keine Favoriten.</li>
      }
    </ul>
  `,
})
export class FavoritesWidget {
  readonly sessionIds = input<number[]>([]);
  private readonly sessions = toSignal(inject(SessionApi).getSessions(), { initialValue: [] });
  protected readonly favorites = computed(() => this.sessions().filter((s) => this.sessionIds().includes(s.id)));
}
