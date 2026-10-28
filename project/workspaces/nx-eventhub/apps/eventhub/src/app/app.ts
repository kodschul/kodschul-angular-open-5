import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="container">
      <p class="muted">EventHub · Nx-Workspace</p>
      <router-outlet />
    </main>
  `,
})
export class App {}
