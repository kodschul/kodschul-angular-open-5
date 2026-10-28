// Lab 4.3: Anmeldeformular mit eigenem Formular-Control TicketCounter (formControlName="tickets").
import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { API_URL, SessionApi } from '../../../shared/api';
import { Registration, Session } from '../../../shared/models';
import { companyEmail, emailNotRegistered, workshopsDoNotOverlap } from '../l02-validators/registration-validators';
import { TicketCounter } from './ticket-counter';

@Component({
  selector: 'app-custom-control-example',
  imports: [ReactiveFormsModule, AsyncPipe, DatePipe, TicketCounter],
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

      <label for="company">Firma</label>
      <input id="company" formControlName="company" />

      <label>Tickets</label>
      <!-- eigenes Control: funktioniert mit formControlName wie ein <input> -->
      <app-ticket-counter formControlName="tickets" [max]="5" />
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
export class CustomControlExample {
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
      tickets: [1], // Grenzen 1–5 prüft TicketCounter selbst (NG_VALIDATORS)
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
