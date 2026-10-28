// Starter Lab 4.2: typisiertes Anmeldeformular aus Lab 4.1, noch ohne eigene Regeln.
// Aufgabe: Validatoren "Firmen-E-Mail", "Workshops überschneiden sich nicht" und
// (Erweiterung) "E-Mail schon angemeldet" schreiben und Fehlermeldungen anzeigen (siehe Übung).
import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { API_URL, SessionApi } from '../shared/api';
import { Registration, Session } from '../shared/models';

export const FREEMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'gmx.de',
  'gmx.net',
  'web.de',
  'yahoo.com',
  'yahoo.de',
  'outlook.com',
  'hotmail.com',
  't-online.de',
  'icloud.com',
];

// TODO Aufgabe 1: Fehler { companyEmail: { domain } } bei Freemail-Domain, sonst null
export function companyEmail(blocked: string[] = FREEMAIL_DOMAINS): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log('companyEmail prüft', control.value, blocked.length);
    return null;
  };
}

// TODO Aufgabe 4: Fehler { workshopOverlap: { first, second } }, wenn sich zwei gewählte Workshops zeitlich überschneiden
export const workshopsDoNotOverlap: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  return null;
};

// Gegeben: überschneiden sich zwei Sessions zeitlich? (start + durationMin)
export function overlaps(a: Session, b: Session): boolean {
  const startA = Date.parse(a.start);
  const startB = Date.parse(b.start);
  const endA = startA + a.durationMin * 60_000;
  const endB = startB + b.durationMin * 60_000;
  return startA < endB && startB < endA;
}

@Component({
  selector: 'app-playground',
  imports: [ReactiveFormsModule, AsyncPipe, DatePipe],
  template: `
    <h1>Anmeldung EventHub</h1>
    <form [formGroup]="form" (ngSubmit)="submit()" class="card">
      <label for="name">Name</label>
      <input id="name" formControlName="name" />
      @if (form.controls.name.touched && form.controls.name.hasError('required')) {
        <p class="error">Name fehlt.</p>
      }

      <label for="email">Firmen-E-Mail</label>
      <input id="email" type="email" formControlName="email" />
      <!-- TODO Aufgabe 3: Fehlermeldungen für required, email und companyEmail -->

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
      <!-- TODO Aufgabe 5: Fehlermeldung für workshopOverlap -->
      <div class="row">
        <button type="button" class="btn" (click)="addWorkshop()">Workshop hinzufügen</button>
      </div>

      <div class="row" style="margin-top: 1rem">
        <button type="submit" class="btn btn-primary">Anmelden</button>
        <span class="muted">Status: {{ form.status }}</span>
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
    if (this.form.invalid || this.form.pending) {
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
    this.result$ = this.http.post<Registration>(`${API_URL}/registrations`, registration);
  }
}
