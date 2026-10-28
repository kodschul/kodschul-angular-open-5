import { Component, signal } from '@angular/core';
import { LoginCredentials, LoginFormComponent } from './login-form';

// Lab 6.4: Login-Formular einbinden und das gesendete Objekt anzeigen.
// Der Anschluss an POST /auth/login folgt in Lab 9.2.
@Component({
  selector: 'app-signal-forms-example',
  imports: [LoginFormComponent],
  template: `
    <h1>Lab 6.4 Login mit Signal Forms</h1>
    <app-login-form (submitted)="lastSubmit.set($event)" />

    @if (lastSubmit(); as credentials) {
      <p class="card">Gesendet: {{ credentials.email }} / {{ credentials.password.length }} Zeichen Passwort</p>
    }
  `,
})
export class SignalFormsExample {
  protected readonly lastSubmit = signal<LoginCredentials | null>(null);
}
