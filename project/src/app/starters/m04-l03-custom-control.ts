// Starter Lab 4.3: Anmeldeformular aus Lab 4.2 (Validatoren aus dem Beispiel importiert)
// und ein Ticket-Zähler, der noch nicht mit dem Formular verbunden ist.
// Aufgabe: TicketCounter zum Formular-Control machen (ControlValueAccessor, siehe Übung).
import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  companyEmail,
  emailNotRegistered,
  workshopsDoNotOverlap,
} from '../examples/m04-reactive-forms/l02-validators/registration-validators';
import { API_URL, SessionApi } from '../shared/api';
import { Registration, Session } from '../shared/models';

// Zähler-Baustein ohne Formular-Anbindung: zählt nur für sich selbst.
@Component({
  selector: 'app-ticket-counter',
  template: `
    <div class="row" role="group" aria-label="Anzahl Tickets">
      <button type="button" class="btn" (click)="change(-1)" [disabled]="disabled || value <= min" aria-label="Ein Ticket weniger">−</button>
      <output aria-live="polite">{{ value }}</output>
      <button type="button" class="btn" (click)="change(1)" [disabled]="disabled || value >= max" aria-label="Ein Ticket mehr">+</button>
    </div>
  `,
})
export class TicketCounter {
  @Input() min = 1;
  @Input() max = 5;

  value = 1;
  disabled = false;

  change(delta: number): void {
    const next = Math.min(this.max, Math.max(this.min, this.value + delta));
    if (next === this.value) return;
    this.value = next;
  }
}

@Component({
  selector: 'app-playground',
  imports: [ReactiveFormsModule, AsyncPipe, DatePipe],
  template: `
    <h1>Anmeldung EventHub</h1>
    <form [formGroup]="form" (ngSubmit)="submit()" class="card">
      <label for="name">Name</label>
      <input id="name" formControlName="name" />

      <label for="email">Firmen-E-Mail</label>
      <input id="email" type="email" formControlName="email" />
      @let email = form.controls.email;
      @if (email.pending) {
        <p class="loading">Prüfe, ob die E-Mail schon angemeldet ist …</p>
      }
      @if (email.touched && email.errors; as errors) {
        <p class="error">E-Mail prüfen: {{ errors['alreadyRegistered'] ? 'bereits angemeldet' : 'ungültig oder Freemail' }}</p>
      }

      <label for="company">Firma</label>
      <input id="company" formControlName="company" />

      <label for="tickets">Tickets</label>
      <!-- TODO Aufgabe 1: Zahlenfeld durch <app-ticket-counter formControlName="tickets" /> ersetzen -->
      <input id="tickets" type="number" formControlName="tickets" />
      @let tickets = form.controls.tickets;
      <p class="muted">
        Wert {{ tickets.value }} · {{ tickets.touched ? 'berührt' : 'unberührt' }} ·
        {{ tickets.disabled ? 'gesperrt' : 'frei' }}
      </p>
      <div class="row">
        <button type="button" class="btn" (click)="toggleTickets()">
          {{ tickets.disabled ? 'Tickets freigeben' : 'Tickets sperren (Firmenkontingent)' }}
        </button>
        <button type="button" class="btn" (click)="tickets.setValue(3)">Auf 3 setzen</button>
      </div>

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
      @if (form.errors?.['workshopOverlap']; as overlap) {
        <p class="error">„{{ overlap.first }}“ und „{{ overlap.second }}“ finden gleichzeitig statt.</p>
      }
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
  `,
})
export class Playground {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly api = inject(SessionApi);

  readonly workshops$ = this.api.getSessions({ type: 'workshop' });

  readonly form = this.fb.group(
    {
      name: ['', Validators.required],
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email, companyEmail()],
        asyncValidators: [emailNotRegistered(this.http)],
        updateOn: 'blur',
      }),
      company: [''],
      tickets: [1, [Validators.min(1), Validators.max(5)]],
      workshops: this.fb.array<FormControl<Session | null>>([]),
    },
    { validators: [workshopsDoNotOverlap] },
  );

  result$?: Observable<Registration>;

  toggleTickets(): void {
    const tickets = this.form.controls.tickets;
    if (tickets.disabled) {
      tickets.enable();
    } else {
      tickets.disable();
    }
  }

  addWorkshop(): void {
    this.form.controls.workshops.push(this.fb.control<Session | null>(null, Validators.required));
  }

  removeWorkshop(index: number): void {
    this.form.controls.workshops.removeAt(index);
  }

  submit(): void {
    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue(); // enthält tickets auch im gesperrten Zustand
    const registration: Registration = {
      name: raw.name,
      email: raw.email,
      company: raw.company,
      tickets: raw.tickets,
      workshopIds: raw.workshops.filter((w): w is Session => w !== null).map((w) => w.id),
    };
    this.result$ = this.http.post<Registration>(`${API_URL}/registrations`, registration);
  }
}
