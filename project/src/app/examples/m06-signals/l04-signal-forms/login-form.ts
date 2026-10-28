import { Component, booleanAttribute, input, output, signal } from '@angular/core';
import { FormField, FormRoot, email, form, minLength, required } from '@angular/forms/signals';

/** Werte des Login-Formulars; passt zum Body von POST /auth/login. */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login-Formular mit Signal Forms (Lab 6.4), wiederverwendet in Lab 9.2.
 * Inputs:  errorMessage (Fehler vom Server, z. B. 401), busy (Button sperren während der Anfrage)
 * Output:  submitted – sendet { email, password }, wenn das Formular gültig ist
 */
@Component({
  selector: 'app-login-form',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="loginForm" class="card">
      <label for="login-email">E-Mail</label>
      <input id="login-email" type="email" autocomplete="username" [formField]="loginForm.email" />
      @if (loginForm.email().touched()) {
        @for (error of loginForm.email().errors(); track error.kind) {
          <p class="error">{{ error.message }}</p>
        }
      }

      <label for="login-password">Passwort</label>
      <input id="login-password" type="password" autocomplete="current-password" [formField]="loginForm.password" />
      @if (loginForm.password().touched()) {
        @for (error of loginForm.password().errors(); track error.kind) {
          <p class="error">{{ error.message }}</p>
        }
      }

      @if (errorMessage()) {
        <p class="error">{{ errorMessage() }}</p>
      }

      <p class="row" style="margin-top: 1rem">
        <button class="btn btn-primary" type="submit" [disabled]="busy()">Anmelden</button>
        <span class="muted">Formular {{ loginForm().valid() ? 'gültig' : 'ungültig' }}</span>
      </p>
    </form>
  `,
})
export class LoginFormComponent {
  readonly errorMessage = input<string | null>(null);
  readonly busy = input(false, { transform: booleanAttribute });
  readonly submitted = output<LoginCredentials>();

  // Das Modell ist ein normales Signal; das Formular liest und schreibt direkt hinein
  protected readonly model = signal<LoginCredentials>({ email: '', password: '' });

  // Schema-Funktion: Regeln pro Feld, Meldungen direkt am Validator
  protected readonly loginForm = form(
    this.model,
    (path) => {
      required(path.email, { message: 'E-Mail ist Pflicht.' });
      email(path.email, { message: 'Keine gültige E-Mail-Adresse.' });
      required(path.password, { message: 'Passwort ist Pflicht.' });
      minLength(path.password, 6, { message: 'Mindestens 6 Zeichen.' });
    },
    {
      // Wird von [formRoot] beim Absenden aufgerufen, aber nur wenn das Formular gültig ist.
      // Ungültig: alle Felder werden als touched markiert, die Meldungen erscheinen.
      submission: {
        action: async (field) => {
          this.submitted.emit(field().value());
          return undefined; // keine Fehler vom Absenden
        },
      },
    },
  );
}
