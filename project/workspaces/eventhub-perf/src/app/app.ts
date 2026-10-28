import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand">EventHub</a>
      <nav><a routerLink="/">Programm</a></nav>
    </header>
    <main class="container">
      <router-outlet />
    </main>
  `,
})
export class App {}
