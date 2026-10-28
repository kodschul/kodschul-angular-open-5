import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

// Rahmen des EventHub-Labs, ab Lab 9.2 mit Login-Status.
@Component({
  selector: 'eh-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav class="row card">
      <strong>EventHub</strong>
      <a routerLink="sessions" routerLinkActive="badge">Sessions</a>
      <a routerLink="speakers" routerLinkActive="badge">Speaker</a>
      <a routerLink="admin" routerLinkActive="badge">Admin</a>
      <a routerLink="account" routerLinkActive="badge">Mein Konto</a>
      @if (auth.user(); as user) {
        <span class="muted">{{ user.name }} ({{ user.role }})</span>
        <button class="btn" type="button" (click)="logout()">Logout</button>
      } @else {
        <a routerLink="login" routerLinkActive="badge">Login</a>
      }
    </nav>
    <router-outlet />
  `,
})
export class Shell {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['login'], { relativeTo: this.route });
  }
}
