import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

/** Zeigt einen Hinweis, sobald der Service Worker eine neue App-Version geladen hat. */
@Component({
  selector: 'app-update-banner',
  template: `
    @if (updateReady()) {
      <div class="card row">
        <span>Eine neue Version von EventHub ist bereit.</span>
        <button class="btn btn-primary" (click)="reload()">Jetzt neu laden</button>
      </div>
    }
  `,
})
export class UpdateBanner {
  private readonly swUpdate = inject(SwUpdate);
  protected readonly updateReady = signal(false);

  constructor() {
    // isEnabled ist false im Entwicklungsmodus (ng serve) und ohne Service-Worker-Unterstützung.
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
          takeUntilDestroyed(),
        )
        .subscribe(() => this.updateReady.set(true));
    }
  }

  protected reload(): void {
    document.location.reload();
  }
}
