import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// Rahmen des EventHub-Labs: Navigation + Platz für die Feature-Seiten.
// Relative Links ("sessions") funktionieren im Workspace und unter /examples/... gleich.
@Component({
  selector: 'eh-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav class="row card">
      <strong>EventHub</strong>
      <a routerLink="sessions" routerLinkActive="badge">Sessions</a>
      <a routerLink="speakers" routerLinkActive="badge">Speaker</a>
      <a routerLink="admin" routerLinkActive="badge">Admin</a>
    </nav>
    <router-outlet />
  `,
})
export class Shell {}
