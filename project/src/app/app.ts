import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand">EventHub</a>
      <nav>
        <a routerLink="/">Beispiele</a>
        <a routerLink="/playground">Playground</a>
      </nav>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
})
export class App {}
