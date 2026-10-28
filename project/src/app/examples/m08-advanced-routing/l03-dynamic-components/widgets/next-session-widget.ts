import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SessionApi } from '../../../../shared/api';

@Component({
  selector: 'app-next-session-widget',
  imports: [DatePipe],
  template: `
    <h3>Nächste Session{{ track() ? ' · ' + track() : '' }}</h3>
    @if (next(); as s) {
      <p><strong>{{ s.title }}</strong></p>
      <p class="muted">{{ s.start | date: 'dd.MM. HH:mm' }} · {{ s.room }}</p>
    } @else {
      <p class="loading">Keine Session gefunden.</p>
    }
  `,
})
export class NextSessionWidget {
  /** optional: nur Sessions eines Tracks */
  readonly track = input<string>('');
  private readonly sessions = toSignal(inject(SessionApi).getSessions(), { initialValue: [] });
  protected readonly next = computed(
    () =>
      this.sessions()
        .filter((s) => !this.track() || s.track === this.track())
        .sort((a, b) => a.start.localeCompare(b.start))[0],
  );
}
