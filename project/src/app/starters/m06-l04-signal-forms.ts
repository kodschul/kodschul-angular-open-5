import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormField, FormRoot, email, form, minLength, required } from '@angular/forms/signals';

// Starter Lab 6.4: Inhalt nach src/app/playground/playground.ts kopieren.

interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-playground',
  // TODO Aufgabe 4: FormRoot ergänzen
  imports: [JsonPipe, FormField],
  template: `
    <h1>Lab 6.4 Login mit Signal Forms</h1>

    <!-- TODO Aufgabe 4: [formRoot]="loginForm" an <form> binden -->
    <form class="card">
      <label for="login-email">E-Mail</label>
      <input id="login-email" type="email" autocomplete="username" [formField]="loginForm.email" />
      <!-- TODO Aufgabe 3: Fehlermeldungen, sobald das Feld touched ist (auch beim Passwort) -->

      <label for="login-password">Passwort</label>
      <input id="login-password" type="password" autocomplete="current-password" [formField]="loginForm.password" />

      <p class="row" style="margin-top: 1rem">
        <button class="btn btn-primary" type="submit">Anmelden</button>
      </p>
    </form>

    <pre class="card">Modell: {{ model() | json }}</pre>
  `,
})
export class Playground {
  protected readonly model = signal<LoginCredentials>({ email: '', password: '' });

  // TODO Aufgabe 2: Schema-Funktion mit required, email, minLength als zweites Argument
  // TODO Aufgabe 4: Optionen mit submission.action als drittes Argument
  protected readonly loginForm = form(this.model);

  protected readonly lastSubmit = signal<LoginCredentials | null>(null);
}
