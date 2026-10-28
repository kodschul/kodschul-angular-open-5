import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

// Zweite App, die das UI-Kit "eventhub-ui" als npm-Paket nutzen soll (Lab 11.2).
// Ausgangszustand: Badge und Zähler sind noch einfache HTML-Elemente.
@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  template: `
    <main class="container">
      <h1>Anmeldung: Signals in der Praxis</h1>
      <!-- TODO Lab 11.2: durch <eh-session-badge level="Fortgeschritten" /> ersetzen -->
      <span class="badge">Fortgeschritten</span>

      <label for="tickets">Tickets</label>
      <!-- TODO Lab 11.2: durch <eh-ticket-counter [formControl]="tickets" /> ersetzen -->
      <input id="tickets" type="number" min="1" max="5" [formControl]="tickets" />

      <p class="muted">Gewählt: {{ tickets.value }} Ticket(s)</p>
    </main>
  `,
})
export class App {
  protected readonly tickets = new FormControl(1, { nonNullable: true });
}
