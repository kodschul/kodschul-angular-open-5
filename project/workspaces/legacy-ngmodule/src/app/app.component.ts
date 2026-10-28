import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand">EventHub (Legacy)</a>
      <nav>
        <a routerLink="/sessions" routerLinkActive="active">Sessions</a>
        <a routerLink="/about" routerLinkActive="active">Über</a>
      </nav>
    </header>
    <main class="container">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {}
