import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { API_URL } from '../shared/api';
import { LoginResponse } from '../shared/models';

// Starter Lab 9.1: Token von der Mock-API holen und lesbar machen.

/** TODO 3: Base64URL-Teil eines JWT in ein Objekt umwandeln (atob + JSON.parse). */
function decodePart(part: string): unknown {
  return part; // vorerst unverändert
}

@Component({
  selector: 'app-playground',
  imports: [JsonPipe],
  template: `
    <h1>Token lesen</h1>
    <div class="row">
      <button class="btn btn-primary" (click)="login('user@eventhub.test', 'user123')">Login als User</button>
      <button class="btn" (click)="login('admin@eventhub.test', 'admin123')">Login als Admin</button>
    </div>
    @if (token()) {
      <p style="word-break: break-all"><code>{{ token() }}</code></p>
      <div class="grid">
        <section class="card"><h3>Header</h3><pre>{{ header() | json }}</pre></section>
        <section class="card"><h3>Payload</h3><pre>{{ payload() | json }}</pre></section>
      </div>
      <!-- TODO 4: Rolle sowie Ausstellungs- und Ablaufzeit lesbar anzeigen -->
    }
    <!-- TODO 6: Begründung Speicherort (drei Sätze) -->
  `,
})
export class Playground {
  private readonly http = inject(HttpClient);
  protected readonly token = signal('');
  protected readonly header = computed(() => decodePart(this.token().split('.')[0] ?? ''));
  protected readonly payload = computed(() => decodePart(this.token().split('.')[1] ?? ''));

  login(email: string, password: string): void {
    this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, { email, password })
      .subscribe((res) => this.token.set(res.accessToken));
  }
}
