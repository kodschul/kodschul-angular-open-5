// Starter Lab 4.1: Anmeldeformular im Stil älterer Projekte (new FormGroup / new FormControl).
// Aufgabe: auf NonNullableFormBuilder umstellen, FormArray für Workshops ergänzen (siehe Übung).
// Der Workshop-Bereich im Template ist vorbereitet und auskommentiert (Aufgabe 5).
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { API_URL, SessionApi } from '../shared/api';
import { Registration } from '../shared/models';

@Component({
  selector: 'app-playground',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe],
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
      <!-- TODO Aufgabe 5: Kommentarzeichen dieses Blocks entfernen, dann formArrayName und [formControlName] ergänzen
      @let workshops = workshops$ | async;
      <div>
        @for (control of form.controls.workshops.controls; track control; let i = $index) {
          <div class="row">
            <select [attr.aria-label]="'Workshop ' + (i + 1)">
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
      Ende TODO Aufgabe 5 -->

      <div class="row" style="margin-top: 1rem">
        <button type="submit" class="btn btn-primary">Anmelden</button>
        <button type="button" class="btn" (click)="form.reset()">Zurücksetzen</button>
      </div>
    </form>

    @if (result$ | async; as saved) {
      <p class="badge badge-ok">Angemeldet: Nr. {{ saved.id }}, {{ saved.tickets }} Ticket(s)</p>
    }

    <h2>Formularwert</h2>
    <pre>{{ form.value | json }}</pre>
  `,
})
export class Playground {
  private readonly http = inject(HttpClient);
  private readonly api = inject(SessionApi);

  // Workshops für die Auswahl (GET /sessions?type=workshop), im Template mit async pipe nutzen
  readonly workshops$ = this.api.getSessions({ type: 'workshop' });

  // Alter Stil: jedes Feld ist FormControl<… | null>
  readonly form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    company: new FormControl(''),
    tickets: new FormControl(1, [Validators.min(1), Validators.max(5)]),
  });

  result$?: Observable<Registration>;

  submit(): void {
    const value = this.form.value; // Typ prüfen: Maus über "value" halten
    console.log('Anmeldung', value);
    // TODO Aufgabe 6: typisiertes Registration-Objekt bauen und mit send() abschicken
  }

  // Gegeben: schickt die Anmeldung an die Mock-API (POST /registrations)
  send(registration: Registration): void {
    this.result$ = this.http.post<Registration>(`${API_URL}/registrations`, registration);
  }
}
