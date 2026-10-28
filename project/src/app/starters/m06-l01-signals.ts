import { Component, computed, effect, linkedSignal, signal } from '@angular/core';

// Starter Lab 6.1: Inhalt nach src/app/playground/playground.ts kopieren.
// Template und Daten sind fertig; die TODOs betreffen nur die Klasse.

interface Workshop {
  id: number;
  title: string;
  price: number;
}

interface CartItem {
  workshopId: number;
  title: string;
  price: number;
  quantity: number;
}

const WORKSHOPS: Workshop[] = [
  { id: 5, title: 'State Management mit NgRx', price: 290 },
  { id: 6, title: 'Login richtig gemacht: OAuth 2.0 und OIDC', price: 290 },
  { id: 7, title: 'Testen ohne Tränen', price: 290 },
  { id: 10, title: 'Schnell ausgeliefert: Performance und Container', price: 290 },
];

const STORAGE_KEY = 'eventhub-cart';
const DISCOUNT_FROM_TICKETS = 3;

@Component({
  selector: 'app-playground',
  template: `
    <h1>Lab 6.1 Warenkorb mit Signals</h1>

    <section class="card">
      <h2>Ticket hinzufügen</h2>
      <div class="row">
        <select (change)="selectWorkshop($event)">
          @for (workshop of workshops; track workshop.id) {
            <option [value]="workshop.id" [selected]="workshop.id === selectedId()">{{ workshop.title }}</option>
          }
        </select>
        <button class="btn" (click)="quantity.update((q) => Math.max(1, q - 1))">−</button>
        <strong>{{ quantity() }}</strong>
        <button class="btn" (click)="quantity.update((q) => q + 1)">+</button>
        <button class="btn btn-primary" (click)="addToCart()">In den Warenkorb</button>
      </div>
    </section>

    <section class="card">
      <h2>Warenkorb ({{ ticketCount() }} Tickets)</h2>
      @for (item of items(); track item.workshopId) {
        <div class="row">
          <span>{{ item.quantity }} × {{ item.title }}</span>
          <span class="muted">{{ item.price * item.quantity }} €</span>
          <button class="btn" (click)="remove(item.workshopId)">Entfernen</button>
        </div>
      } @empty {
        <p class="muted">Noch keine Tickets.</p>
      }
      <p>Zwischensumme: {{ subtotal() }} €</p>
      @if (discount() > 0) {
        <p class="badge badge-ok">Rabatt ab {{ discountFrom }} Tickets: −{{ discount() }} €</p>
      }
      <p><strong>Summe: {{ total() }} €</strong></p>
    </section>
  `,
})
export class Playground {
  protected readonly Math = Math;
  protected readonly workshops = WORKSHOPS;
  protected readonly discountFrom = DISCOUNT_FROM_TICKETS;

  // TODO Aufgabe 5: Startwert aus localStorage lesen (Schlüssel STORAGE_KEY)
  protected readonly items = signal<CartItem[]>([]);
  protected readonly selectedId = signal(WORKSHOPS[0].id);

  // TODO Aufgabe 6: durch linkedSignal ersetzen, das bei Workshop-Wechsel auf 1 zurückspringt
  protected readonly quantity = signal(1);

  // TODO Aufgabe 3 und 4: echte Berechnungen eintragen
  protected readonly ticketCount = computed(() => 0);
  protected readonly subtotal = computed(() => 0);
  protected readonly discount = computed(() => 0);
  protected readonly total = computed(() => 0);

  constructor() {
    // TODO Aufgabe 5: effect, der items() im localStorage speichert
  }

  protected selectWorkshop(event: Event): void {
    this.selectedId.set(Number((event.target as HTMLSelectElement).value));
  }

  protected addToCart(): void {
    const workshop = WORKSHOPS.find((w) => w.id === this.selectedId())!;
    const quantity = this.quantity();
    // TODO Aufgabe 2: Position hinzufügen oder Menge erhöhen (items.update, neues Array)
    console.log('hinzufügen', workshop.title, quantity);
  }

  /** Fertig: Position entfernen, neues Array per filter. */
  protected remove(workshopId: number): void {
    this.items.update((items) => items.filter((item) => item.workshopId !== workshopId));
  }
}
