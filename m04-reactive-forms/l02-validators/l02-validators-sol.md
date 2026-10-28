# Lab 4.2 – Lösung: Eigene Validatoren: synchron, asynchron, feldübergreifend

Referenz: `src/app/examples/m04-reactive-forms/l02-validators/` (`registration-validators.ts`, `example.ts`), im Browser `/examples/m04-reactive-forms/l02-validators`. Das Beispiel enthält auch die Erweiterung (asynchroner Validator).

## Aufgabe 1: `companyEmail`

```ts
export function companyEmail(blocked: string[] = FREEMAIL_DOMAINS): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const domain = String(control.value ?? '').split('@')[1]?.trim().toLowerCase();
    if (!domain) return null;
    return blocked.includes(domain) ? { companyEmail: { domain } } : null;
  };
}
```

`split('@')[1]` ist bei einer Eingabe ohne `@` `undefined`; der optionale Zugriff `?.` liefert dann `undefined`, und der Validator meldet nichts. Ungültige Adressen meldet `Validators.email`.

## Aufgabe 2: Validator anhängen

```ts
email: ['', [Validators.required, Validators.email, companyEmail()]],
```

`companyEmail()` mit Klammern: Die Fabrik liefert die eigentliche `ValidatorFn`.

## Aufgabe 3: Meldungen

```html
<label for="email">Firmen-E-Mail</label>
<input id="email" type="email" formControlName="email" />
@let email = form.controls.email;
@if (email.touched && email.errors; as errors) {
  @if (errors['required']) {
    <p class="error">E-Mail fehlt.</p>
  } @else if (errors['email']) {
    <p class="error">Keine gültige E-Mail-Adresse.</p>
  } @else if (errors['companyEmail']) {
    <p class="error">Bitte eine Firmenadresse verwenden ({{ errors['companyEmail'].domain }} ist ein Freemail-Anbieter).</p>
  }
}
```

Die `@else if`-Kette zeigt immer nur die wichtigste Meldung.

## Aufgabe 4: `workshopsDoNotOverlap`

```ts
export const workshopsDoNotOverlap: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const selected = (group.get('workshops')?.value ?? []) as (Session | null)[];
  const workshops = selected.filter((w): w is Session => w !== null);
  for (let i = 0; i < workshops.length; i++) {
    for (let j = i + 1; j < workshops.length; j++) {
      if (overlaps(workshops[i], workshops[j])) {
        return { workshopOverlap: { first: workshops[i].title, second: workshops[j].title } };
      }
    }
  }
  return null;
};
```

`group.get('workshops')` liefert ein `AbstractControl`; der Validator kennt den genauen Formulartyp nicht und castet deshalb den Wert. Dieselbe Workshop-Auswahl zweimal gilt ebenfalls als Überschneidung.

## Aufgabe 5: Gruppen-Validator und Meldung

```ts
readonly form = this.fb.group(
  {
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, companyEmail()]],
    company: [''],
    tickets: [1, [Validators.min(1), Validators.max(5)]],
    workshops: this.fb.array<FormControl<Session | null>>([]),
  },
  { validators: [workshopsDoNotOverlap] },
);
```

```html
@if (form.errors?.['workshopOverlap']; as overlap) {
  <p class="error">„{{ overlap.first }}“ und „{{ overlap.second }}“ finden gleichzeitig statt.</p>
}
```

## Aufgabe 6: Test

| Auswahl | Ergebnis |
| --- | --- |
| „State Management mit NgRx“ + „Login richtig gemacht: OAuth 2.0 und OIDC“ | „„State Management mit NgRx“ und „Login richtig gemacht: OAuth 2.0 und OIDC“ finden gleichzeitig statt.“, Status `INVALID` |
| „State Management mit NgRx“ + „Testen ohne Tränen“ | keine Meldung, Status `VALID` (sofern Name und E-Mail gültig) |
| zweimal „Testen ohne Tränen“ | Überschneidungsmeldung |

## Aufgabe 7: `emailNotRegistered`

Zusätzliche Imports: `AsyncValidatorFn` aus `@angular/forms`, `map` aus `rxjs`, `HttpClient` ist schon importiert.

```ts
export function emailNotRegistered(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl) =>
    http
      .get<Registration[]>(`${API_URL}/registrations`, { params: { email: String(control.value) } })
      .pipe(map((found) => (found.length > 0 ? { alreadyRegistered: true } : null)));
}
```

## Aufgabe 8: Objekt-Schreibweise mit `updateOn`

```ts
email: this.fb.control('', {
  validators: [Validators.required, Validators.email, companyEmail()],
  asyncValidators: [emailNotRegistered(this.http)],
  updateOn: 'blur',
}),
```

`http` muss in der Klasse vor `form` stehen, weil Felder in Reihenfolge initialisiert werden.

## Aufgabe 9: Anzeige

```html
@let email = form.controls.email;
@if (email.pending) {
  <p class="loading">Prüfe, ob die E-Mail schon angemeldet ist …</p>
}
@if (email.touched && email.errors; as errors) {
  @if (errors['required']) {
    <p class="error">E-Mail fehlt.</p>
  } @else if (errors['email']) {
    <p class="error">Keine gültige E-Mail-Adresse.</p>
  } @else if (errors['companyEmail']) {
    <p class="error">Bitte eine Firmenadresse verwenden ({{ errors['companyEmail'].domain }} ist ein Freemail-Anbieter).</p>
  } @else if (errors['alreadyRegistered']) {
    <p class="error">Diese E-Mail ist bereits angemeldet.</p>
  }
}
```

`email.pending` ist `true`, solange der asynchrone Validator läuft. Trifft die API-Antwort ein, aktualisiert Angular die Ansicht ohne weiteren Klick; `statusChanges` mit der `async`-Pipe ist dafür nicht nötig.

## Aufgabe 10: Test

| Eingabe, dann Feld verlassen | Anfragen an `/registrations` | Anzeige |
| --- | --- | --- |
| `kim.berger@beispiel-firma.de` | 1 | kurz „Prüfe …“, dann „Diese E-Mail ist bereits angemeldet.“ |
| `neu@beispiel-firma.de` | 1 | keine Meldung |
| `max@gmail.com` | 0 | Freemail-Meldung; die API-Prüfung läuft nicht, weil eine synchrone Regel scheitert |

Mit `updateOn: 'change'` ginge pro Tastendruck eine Anfrage raus. Um „Prüfe …“ länger zu sehen, die Mock-API verzögern und danach zurücksetzen:

```bash
curl -X POST http://localhost:3000/_control -H 'Content-Type: application/json' -d '{"delay":1500}'
curl -X POST http://localhost:3000/_control -H 'Content-Type: application/json' -d '{"delay":0}'
```

Adressen, die in Lab 4.1 abgeschickt wurden, gelten ebenfalls als angemeldet, bis die Mock-API neu startet.
