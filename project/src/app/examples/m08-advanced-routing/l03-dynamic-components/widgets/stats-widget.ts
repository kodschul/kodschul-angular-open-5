import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SessionApi } from '../../../../shared/api';

@Component({
  selector: 'app-stats-widget',
  template: `
    <h3>{{ title() }}</h3>
    <p><strong>{{ sessions().length }}</strong> Sessions · <strong>{{ utilization() }} %</strong> gebucht</p>
    <p class="muted">{{ soldOut() }} ausgebucht</p>
  `,
})
export class StatsWidget {
  readonly title = input('Statistik');
  protected readonly sessions = toSignal(inject(SessionApi).getSessions(), { initialValue: [] });
  protected readonly utilization = computed(() => {
    const capacity = this.sessions().reduce((sum, s) => sum + s.capacity, 0);
    const booked = this.sessions().reduce((sum, s) => sum + s.booked, 0);
    return capacity ? Math.round((booked / capacity) * 100) : 0;
  });
  protected readonly soldOut = computed(() => this.sessions().filter((s) => s.booked >= s.capacity).length);
}
