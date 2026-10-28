// Lab 4.1: Typisiertes Anmeldeformular mit NonNullableFormBuilder und FormArray für Workshops.
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { API_URL, SessionApi } from '../../../shared/api';
import { Registration, Session } from '../../../shared/models';

@Component({
  selector: 'app-typed-forms-example',
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
      @if (form.invalid && form.touched) {
        <p class="error">Bitte Name, gültige E-Mail und alle Workshop-Felder ausfüllen.</p>
      }
    </form>

    @if (result$ | async; as saved) {
      <p class="badge badge-ok">Angemeldet: Nr. {{ saved.id }}, {{ saved.tickets }} Ticket(s)</p>
    }

    <h2>Formularwert (getRawValue)</h2>
    <pre>{{ form.getRawValue() | json }}</pre>
  `,
})
export class TypedFormsExample {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly api = inject(SessionApi);

  readonly workshops$ = this.api.getSessions({ type: 'workshop' });

  // Typ: FormGroup<{ name: FormControl<string>; …; workshops: FormArray<FormControl<Session | null>> }>
  readonly form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    tickets: [1, [Validators.min(1), Validators.max(5)]],
    workshops: this.fb.array<FormControl<Session | null>>([]),
  });

  // wird erst im Klick-Handler gesetzt; die async pipe startet die Anfrage
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
    const raw = this.form.getRawValue(); // Typ ohne Partial, auch deaktivierte Felder
    const registration: Registration = {
      name: raw.name,
      email: raw.email,
      company: raw.company,
      tickets: raw.tickets,
      workshopIds: raw.workshops.filter((w): w is Session => w !== null).map((w) => w.id),
    };
    console.log('Anmeldung', registration);
    this.result$ = this.http.post<Registration>(`${API_URL}/registrations`, registration);
  }
}
