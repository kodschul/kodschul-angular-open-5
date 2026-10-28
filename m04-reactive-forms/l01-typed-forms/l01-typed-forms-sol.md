# Lab 4.1 – Lösung: Typed Reactive Forms

Referenz: `src/app/examples/m04-reactive-forms/l01-typed-forms/example.ts`, im Browser `/examples/m04-reactive-forms/l01-typed-forms`.

## Aufgabe 1: Typ im Starter

```ts
const value: Partial<{
  name: string | null;
  email: string | null;
  company: string | null;
  tickets: number | null;
}>
```

Jedes Feld ist optional (`Partial`, wegen deaktivierter Felder) und kann `null` sein (wegen `reset()`).

## Aufgabe 2: Reset im Starter

```json
{ "name": null, "email": null, "company": null, "tickets": null }
```

## Aufgabe 3: `NonNullableFormBuilder`

```ts
private readonly fb = inject(NonNullableFormBuilder);

readonly form = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  company: [''],
  tickets: [1, [Validators.min(1), Validators.max(5)]],
});
```

- Typ von `value`: `Partial<{ name: string; email: string; company: string; tickets: number }>`.
- Nach „Zurücksetzen“: `{ "name": "", "email": "", "company": "", "tickets": 1 }`.

## Aufgaben 4–7: vollständige Arbeitsdatei

```ts
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { API_URL, SessionApi } from '../shared/api';
import { Registration, Session } from '../shared/models';

@Component({
  selector: 'app-playground',
  imports: [ReactiveFormsModule, AsyncPipe, DatePipe, JsonPipe],
  template: `
    <h1>Anmeldung EventHub</h1>
    <form [formGroup]="form" (ngSubmit)="submit()" class="card">
      <label for="name">Name</label>
      <input id="name" formControlName="name" />

      <label for="email">E-Mail</label>
      <input id="email" type="email" formControlName="email" />

      <label for="company">Firma</label>
      <input id="company" formControlName="company" />

      <label for="tickets">Tickets</label>
      <input id="tickets" type="number" formControlName="tickets" />

      <h2>Workshops</h2>
      @let workshops = workshops$ | async;
      <div formArrayName="workshops">
        @for (control of form.controls.workshops.controls; track control; let i = $index) {
          <div class="row">
            <select [formControlName]="i" [attr.aria-label]="'Workshop ' + (i + 1)">
              <option [ngValue]="null">Workshop wählen …</option>
              @for (workshop of workshops; track workshop.id) {
                <option [ngValue]="workshop">{{ workshop.title }} ({{ workshop.start | date: 'EEE HH:mm' }})</option>
              }
            </select>
            <button type="button" class="btn" (click)="removeWorkshop(i)">Entfernen</button>
          </div>
        } @empty {
          <p class="muted">Noch kein Workshop gewählt.</p>
        }
      </div>
      <div class="row">
        <button type="button" class="btn" (click)="addWorkshop()">Workshop hinzufügen</button>
      </div>

      <div class="row" style="margin-top: 1rem">
        <button type="submit" class="btn btn-primary">Anmelden</button>
        <button type="button" class="btn" (click)="form.reset()">Zurücksetzen</button>
      </div>
    </form>

    @if (result$ | async; as saved) {
      <p class="badge badge-ok">Angemeldet: Nr. {{ saved.id }}, {{ saved.tickets }} Ticket(s)</p>
    }

    <h2>Formularwert</h2>
    <pre>{{ form.getRawValue() | json }}</pre>
  `,
})
export class Playground {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly api = inject(SessionApi);

  readonly workshops$ = this.api.getSessions({ type: 'workshop' });

  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    tickets: [1, [Validators.min(1), Validators.max(5)]],
    workshops: this.fb.array<FormControl<Session | null>>([]),
  });

  result$?: Observable<Registration>;

  addWorkshop(): void {
    this.form.controls.workshops.push(this.fb.control<Session | null>(null, Validators.required));
  }

  removeWorkshop(index: number): void {
    this.form.controls.workshops.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const registration: Registration = {
      name: raw.name,
      email: raw.email,
      company: raw.company,
      tickets: raw.tickets,
      workshopIds: raw.workshops.filter((w): w is Session => w !== null).map((w) => w.id),
    };
    console.log('Anmeldung', registration);
    this.send(registration);
  }

  send(registration: Registration): void {
    this.result$ = this.http.post<Registration>(`${API_URL}/registrations`, registration);
  }
}
```

Aufgabe 5 im Detail: Aus dem vorbereiteten Block werden `<div formArrayName="workshops">` und `<select [formControlName]="i" …>`; der Rest des Blocks bleibt unverändert. `DatePipe` steht in `imports`, weil der Block die `date`-Pipe nutzt.

Entscheidungen:

- `fb.array<FormControl<Session | null>>([])`: Der Typparameter legt fest, welche Controls ins Array dürfen; aus dem leeren Array allein kann TypeScript keinen Control-Typ ableiten.
- `Session | null` mit Startwert `null`: Ein neues Auswahlfeld ist bewusst leer, `Validators.required` verhindert das Absenden.
- `(w): w is Session => w !== null` ist ein Type Guard: Nach dem `filter` kennt TypeScript den Typ `Session[]`.

Konsole nach dem Absenden mit Workshop „State Management mit NgRx“:

```text
Anmeldung {name: 'Kim Test', email: 'kim.test@beispiel-firma.de', company: 'Beispiel Firma GmbH', tickets: 2, workshopIds: [5]}
```

Die Mock-API antwortet mit `201` und dem gespeicherten Objekt inklusive `id` und `createdAt`; die Seite zeigt „Angemeldet: Nr. 2, 2 Ticket(s)“. Die Nummer steigt mit jeder Anmeldung, bis die Mock-API neu startet.

## Erweiterung

Deaktiviertes Feld:

```ts
// z. B. als Button-Handler
lockCompany(): void {
  this.form.controls.company.disable();
}
```

`form.value` enthält danach kein `company` mehr, `form.getRawValue()` schon.

Workshop nicht doppelt wählbar:

```ts
takenElsewhere(workshop: Session, index: number): boolean {
  return this.form.controls.workshops.controls.some((c, i) => i !== index && c.value?.id === workshop.id);
}
```

```html
@for (workshop of workshops; track workshop.id) {
  @if (!takenElsewhere(workshop, i)) {
    <option [ngValue]="workshop">{{ workshop.title }} ({{ workshop.start | date: 'EEE HH:mm' }})</option>
  }
}
```
