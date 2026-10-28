# Lab 6.4 – Lösung: Login-Formular mit Signal Forms

Referenz: `src/app/examples/m06-signals/l04-signal-forms/login-form.ts` (Komponente `LoginFormComponent`, Selektor `app-login-form`) und `example.ts`, im Browser `/examples/m06-signals/l04-signal-forms`.

## Aufgabe 1: Starter

Jeder Tastendruck erscheint sofort in der Modell-Ausgabe. Der Starter bindet beide Felder bereits:

```ts
imports: [JsonPipe, FormField],
```

```html
<input id="login-email" type="email" autocomplete="username" [formField]="loginForm.email" />
<input id="login-password" type="password" autocomplete="current-password" [formField]="loginForm.password" />
```

`FormField` schreibt in beide Richtungen: Eine Eingabe landet im Modell-Signal, eine Änderung am Modell erscheint im Feld.

## Aufgabe 2: Schema-Funktion

```ts
protected readonly loginForm = form(this.model, (path) => {
  required(path.email, { message: 'E-Mail ist Pflicht.' });
  email(path.email, { message: 'Keine gültige E-Mail-Adresse.' });
  required(path.password, { message: 'Passwort ist Pflicht.' });
  minLength(path.password, 6, { message: 'Mindestens 6 Zeichen.' });
});
```

`path` beschreibt die Struktur des Modells; die Schema-Funktion läuft einmal und hängt die Regeln an die Pfade.

## Aufgabe 3: Fehlermeldungen und Gültigkeit

```html
<input id="login-email" type="email" autocomplete="username" [formField]="loginForm.email" />
@if (loginForm.email().touched()) {
  @for (error of loginForm.email().errors(); track error.kind) {
    <p class="error">{{ error.message }}</p>
  }
}

<input id="login-password" type="password" autocomplete="current-password" [formField]="loginForm.password" />
@if (loginForm.password().touched()) {
  @for (error of loginForm.password().errors(); track error.kind) {
    <p class="error">{{ error.message }}</p>
  }
}

<p class="row" style="margin-top: 1rem">
  <button class="btn btn-primary" type="submit">Anmelden</button>
  <span class="muted">Formular {{ loginForm().valid() ? 'gültig' : 'ungültig' }}</span>
</p>
```

`loginForm.email()` liefert den Zustand des Felds, `loginForm()` den des ganzen Formulars.

## Aufgabe 4: Absenden mit `[formRoot]`

```ts
imports: [JsonPipe, FormField, FormRoot],
```

```ts
protected readonly lastSubmit = signal<LoginCredentials | null>(null);

protected readonly loginForm = form(
  this.model,
  (path) => {
    required(path.email, { message: 'E-Mail ist Pflicht.' });
    email(path.email, { message: 'Keine gültige E-Mail-Adresse.' });
    required(path.password, { message: 'Passwort ist Pflicht.' });
    minLength(path.password, 6, { message: 'Mindestens 6 Zeichen.' });
  },
  {
    submission: {
      action: async (field) => {
        this.lastSubmit.set(field().value());
        return undefined;
      },
    },
  },
);
```

```html
<form [formRoot]="loginForm" class="card">
  …
</form>

@if (lastSubmit(); as credentials) {
  <p class="card">Gesendet: {{ credentials.email }}</p>
}
```

Die `action` läuft erst beim Absenden; deshalb darf sie auf `lastSubmit` zugreifen, auch wenn das Feld in der Klasse weiter unten steht.

## Aufgabe 5: Drei Fälle

| Eingabe | Ergebnis |
| --- | --- |
| leer | „E-Mail ist Pflicht.“, „Passwort ist Pflicht.“; „Formular ungültig“; `lastSubmit` bleibt leer |
| `user.eventhub.test` / `123` | „Keine gültige E-Mail-Adresse.“, „Mindestens 6 Zeichen.“; keine Aktion |
| `user@eventhub.test` / `user123` | keine Meldung, „Formular gültig“, „Gesendet: user@eventhub.test“ |

Beim Absenden markiert `[formRoot]` alle Felder als berührt (deshalb erscheinen Meldungen auch ohne vorheriges Verlassen) und führt die `action` nur bei gültigem Formular aus. Die Seite lädt nicht neu, weil `FormRoot` das Standardverhalten von `submit` unterbindet.

## Erweiterung

Wiederverwendbare Komponente (gekürzt, vollständig im Beispielordner):

```ts
export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [FormField, FormRoot],
  template: `<form [formRoot]="loginForm" class="card">…</form>`,
})
export class LoginFormComponent {
  readonly errorMessage = input<string | null>(null); // z. B. Antwort 401 aus Lab 9.2
  readonly busy = input(false, { transform: booleanAttribute }); // Button sperren während der Anfrage
  readonly submitted = output<LoginCredentials>();

  protected readonly model = signal<LoginCredentials>({ email: '', password: '' });
  protected readonly loginForm = form(this.model, (path) => { /* Regeln wie oben */ }, {
    submission: {
      action: async (field) => {
        this.submitted.emit(field().value());
        return undefined;
      },
    },
  });
}
```

```html
<app-login-form (submitted)="lastSubmit.set($event)" />
```

Testdaten:

```ts
protected fillTestData(): void {
  this.model.set({ email: 'user@eventhub.test', password: 'user123' });
}
```

Beide Felder zeigen sofort die Werte; das Formular wird gültig. Das Modell ist die Quelle, die Felder folgen.
