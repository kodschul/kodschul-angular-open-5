import { Component, inject } from '@angular/core';
import { AuthService } from './auth.service';

// Gleicher Pfad wie der Admin-Bereich, aber ohne Guard: greift, wenn adminMatchGuard false liefert.
@Component({
  selector: 'eh-no-access-page',
  template: `
    <h1>Kein Zugriff</h1>
    <p>{{ auth.user()?.name }} hat die Rolle <span class="badge">{{ auth.user()?.role }}</span>; der Admin-Bereich braucht <span class="badge">admin</span>.</p>
  `,
})
export class NoAccessPage {
  protected readonly auth = inject(AuthService);
}
