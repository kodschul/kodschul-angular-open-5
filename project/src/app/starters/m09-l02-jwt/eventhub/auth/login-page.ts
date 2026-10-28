import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginCredentials, LoginFormComponent } from '../../login-form';

@Component({
  selector: 'eh-login-page',
  imports: [LoginFormComponent],
  template: `
    <h1>Login</h1>
    @if (reason() === 'expired') {
      <p class="error">Sitzung abgelaufen. Bitte erneut anmelden.</p>
    }
    <!-- Formular aus Lab 6.4: Inputs errorMessage und busy, Output submitted -->
    <app-login-form [errorMessage]="error()" [busy]="busy()" (submitted)="login($event)" />
    <label class="row">
      <input type="checkbox" style="width: auto" [checked]="shortToken()" (change)="shortToken.set(!shortToken())" />
      Token nach 10 s ablaufen lassen (Test)
    </label>
    <p class="muted">Test-Konten: admin&#64;eventhub.test / admin123 · user&#64;eventhub.test / user123</p>
  `,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Query-Parameter ?returnUrl=…&reason=… über withComponentInputBinding */
  readonly returnUrl = input<string>();
  readonly reason = input<string>();

  protected readonly shortToken = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly busy = signal(false);

  login(credentials: LoginCredentials): void {
    // TODO 2: auth.login(...) aufrufen (expiresIn 10 oder 3600 je nach shortToken),
    //         bei Erfolg zu returnUrl bzw. '../sessions' navigieren, bei Fehler error setzen.
    console.log('Login-Daten aus dem Formular', credentials.email);
  }
}
