import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Rahmen nur für den Einzelstart des Remotes; der Host nutzt ihn nicht. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="container">
      <p class="muted">federation-admin · Einzelstart auf Port 4201</p>
      <router-outlet />
    </main>
  `,
})
export class App {}
