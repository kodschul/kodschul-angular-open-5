import { Component, computed, effect, linkedSignal, signal } from '@angular/core';

// Lab 6.1: Warenkorb für Workshop-Tickets mit signal, computed, linkedSignal und effect.

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

/** Workshops aus der Mock-API (api/db.json), hier fest eingetragen. */
const WORKSHOPS: Workshop[] = [
  { id: 5, title: 'State Management mit NgRx', price: 290 },
  { id: 6, title: 'Login richtig gemacht: OAuth 2.0 und OIDC', price: 290 },
  { id: 7, title: 'Testen ohne Tränen', price: 290 },
  { id: 10, title: 'Schnell ausgeliefert: Performance und Container', price: 290 },
];

const STORAGE_KEY = 'eventhub-cart';
const DISCOUNT_FROM_TICKETS = 3; // ab 3 Tickets 10 % Rabatt

function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CartItem[];
  } catch {
    return [];
  }
}

@Component({
  selector: 'app-signals-example',
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
export class SignalsExample {
  protected readonly Math = Math;
  protected readonly workshops = WORKSHOPS;
  protected readonly discountFrom = DISCOUNT_FROM_TICKETS;

  // Zustand: beschreibbare Signals
  protected readonly items = signal<CartItem[]>(loadCart());
  protected readonly selectedId = signal(WORKSHOPS[0].id);

  // linkedSignal: beschreibbar, wird aber auf 1 zurückgesetzt, sobald sich selectedId ändert
  protected readonly quantity = linkedSignal(() => {
    this.selectedId();
    return 1;
  });

  // Abgeleitete Werte: computed, nie per effect setzen
  protected readonly ticketCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  protected readonly subtotal = computed(() => this.items().reduce((sum, item) => sum + item.price * item.quantity, 0));
  protected readonly discount = computed(() =>
    this.ticketCount() >= DISCOUNT_FROM_TICKETS ? Math.round(this.subtotal() * 0.1) : 0,
  );
  protected readonly total = computed(() => this.subtotal() - this.discount());

  constructor() {
    // Seiteneffekt nach außen: bei jeder Änderung von items() speichern
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
      console.log('Warenkorb gespeichert', this.items().length, 'Positionen');
    });
  }

  protected selectWorkshop(event: Event): void {
    this.selectedId.set(Number((event.target as HTMLSelectElement).value));
  }

  protected addToCart(): void {
    const workshop = WORKSHOPS.find((w) => w.id === this.selectedId())!;
    const quantity = this.quantity();
    // Immer ein neues Array erzeugen: Signals vergleichen per Referenz
    this.items.update((items) =>
      items.some((item) => item.workshopId === workshop.id)
        ? items.map((item) => (item.workshopId === workshop.id ? { ...item, quantity: item.quantity + quantity } : item))
        : [...items, { workshopId: workshop.id, title: workshop.title, price: workshop.price, quantity }],
    );
  }

  protected remove(workshopId: number): void {
    this.items.update((items) => items.filter((item) => item.workshopId !== workshopId));
  }
}
