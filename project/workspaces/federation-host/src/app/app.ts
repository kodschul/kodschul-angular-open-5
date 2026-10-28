import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <main class="container">
      <nav class="row">
        <strong>EventHub Host</strong>
        <a routerLink="/">Start</a>
        <a routerLink="/admin">Admin (Remote)</a>
      </nav>
      <router-outlet />
    </main>
  `,
})
export class App {}
