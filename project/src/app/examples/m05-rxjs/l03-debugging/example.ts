import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// Lab 5.3: Rahmen mit drei Kind-Routen. Konsole öffnen und zwischen den Links wechseln.
@Component({
  selector: 'app-debugging-example',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>Lab 5.3 Streams debuggen und aufräumen</h1>
    <nav class="row">
      <a class="btn" routerLink="ticker-leck" routerLinkActive="btn-primary">Ticker mit Leck</a>
      <a class="btn" routerLink="ticker" routerLinkActive="btn-primary">Ticker aufgeräumt</a>
      <a class="btn" routerLink="info" routerLinkActive="btn-primary">Andere Seite</a>
    </nav>
    <section class="card" style="margin-top: 1rem">
      <router-outlet />
    </section>
  `,
})
export class DebuggingExample {}
