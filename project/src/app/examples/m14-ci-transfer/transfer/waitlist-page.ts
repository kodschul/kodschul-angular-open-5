// Transferprojekt „EventHub Release“: Referenz für den Kern des Features „Warteliste“.
import { httpResource } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { injectDispatch } from '@ngrx/signals/events';
import { fromEvent, map, merge } from 'rxjs';
import { API_URL } from '../../../shared/api';
import { Session } from '../../../shared/models';
import { notOnWaitlist } from './waitlist-validators';
import { waitlistPageEvents } from './waitlist.events';
import { WaitlistStore } from './waitlist.store';

@Component({
  selector: 'app-waitlist-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    @if (!online()) {
      <p class="card badge-warn">Offline: Die Warteliste wird gesendet, sobald wieder eine Verbindung besteht.</p>
    }

    @if (session.hasValue()) {
      <h1>Warteliste: {{ session.value().title }}</h1>
      <p class="muted">
        <span class="badge badge-error">ausgebucht</span>
        {{ session.value().booked }} / {{ session.value().capacity }} Plätze · {{ store.count() }} auf der Warteliste
      </p>
    }

    <form class="card" [formGroup]="form" (ngSubmit)="join()" data-cy="waitlist-form">
      <label for="name">Name</label>
      <input id="name" formControlName="name" data-cy="waitlist-name" />

      <label for="email">E-Mail</label>
      <input id="email" type="email" formControlName="email" data-cy="waitlist-email" />
      @if (form.controls.email.hasError('notOnWaitlist')) {
        <p class="error">Diese E-Mail steht bereits auf der Warteliste.</p>
      }

      <p>
        <button class="btn btn-primary" type="submit" [disabled]="form.invalid || store.pending()" data-cy="waitlist-submit">
          Auf die Warteliste
        </button>
      </p>
      @if (store.error(); as error) {
        <p class="error" data-cy="waitlist-error">{{ error }}</p>
      }
    </form>

    @if (store.count() > 0) {
      <div class="card" data-cy="waitlist-entries">
        <h2>Eingetragen</h2>
        <ul>
          @for (entry of store.entries(); track entry.id) {
            <li>{{ entry.name }} ({{ entry.email }})</li>
          }
        </ul>
      </div>
    }

    <p><a routerLink="/examples/m14-ci-transfer/transfer">← Transferprojekt</a></p>
  `,
})
export class WaitlistPage {
  /** Routen-Parameter :sessionId (withComponentInputBinding). */
  readonly sessionId = input.required<string>();

  protected readonly store = inject(WaitlistStore);
  private readonly dispatch = injectDispatch(waitlistPageEvents);

  protected readonly session = httpResource<Session>(() => `${API_URL}/sessions/${this.sessionId()}`);

  protected readonly online = toSignal(
    merge(fromEvent(window, 'online').pipe(map(() => true)), fromEvent(window, 'offline').pipe(map(() => false))),
    { initialValue: navigator.onLine },
  );

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        notOnWaitlist(() => this.store.entries(), () => Number(this.sessionId())),
      ],
    }),
  });

  protected join(): void {
    if (this.form.invalid) return;
    this.dispatch.joinRequested({ sessionId: Number(this.sessionId()), ...this.form.getRawValue() });
    this.form.reset();
  }
}
