import { Component, ViewEncapsulation, input, numberAttribute, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

/** Nutzdaten des DOM-Events "registered". */
export interface SignupDetail {
  sessionTitle: string;
  name: string;
  email: string;
  tickets: number;
}

/**
 * Anmelde-Widget für fremde Seiten (CMS, andere Frameworks).
 * Wird in main.ts als Custom Element <eventhub-signup> registriert.
 */
@Component({
  selector: 'eventhub-signup-widget',
  imports: [ReactiveFormsModule],
  // Shadow DOM: CSS der Gastseite wirkt nicht hinein, eigenes CSS nicht hinaus.
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <h3>Anmeldung: {{ sessionTitle() }}</h3>
      <label>Name <input formControlName="name" /></label>
      <label>E-Mail <input type="email" formControlName="email" /></label>
      <!-- [max] auf input type=number aktiviert den eingebauten Max-Validator von Angular -->
      <label>Tickets <input type="number" min="1" [max]="maxTickets()" formControlName="tickets" /></label>
      <button type="submit" [disabled]="form.invalid">Anmelden</button>
    </form>
  `,
  styles: `
    :host { display: block; font-family: system-ui, sans-serif; max-width: 360px; }
    form { border: 1px solid #dde1e8; border-radius: 8px; padding: 1rem; background: #fff; }
    h3 { margin-top: 0; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
    input { display: block; width: 100%; padding: 0.3rem; font: inherit; }
    button { background: #c3002f; color: #fff; border: 0; border-radius: 6px; padding: 0.45rem 0.9rem; font: inherit; }
    button:disabled { opacity: 0.5; }
  `,
})
export class SignupWidget {
  /** Attribut session-title (Strings kommen als Attribut an). */
  readonly sessionTitle = input('EventHub Konferenz');
  /** Attribut max-tickets: Attribute sind immer Text, numberAttribute wandelt in eine Zahl. */
  readonly maxTickets = input(5, { transform: numberAttribute });
  /** Wird für die Gastseite zum DOM-Event "registered" (CustomEvent, Daten in event.detail). */
  readonly registered = output<SignupDetail>();

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    tickets: new FormControl(1, { nonNullable: true, validators: [Validators.min(1)] }),
  });

  protected submit(): void {
    const { name, email, tickets } = this.form.getRawValue();
    this.registered.emit({ sessionTitle: this.sessionTitle(), name, email, tickets });
    this.form.reset();
  }
}
