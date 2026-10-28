# Lab 6.1 – Lösung: Warenkorb für Workshop-Tickets

Referenz: `src/app/examples/m06-signals/l01-signals/example.ts`, im Browser `/examples/m06-signals/l01-signals`.

## Aufgabe 1: Starter

Die Konsole zeigt `hinzufügen State Management mit NgRx 1`, der Warenkorb bleibt leer („Noch keine Tickets.“), alle Summen stehen auf 0.

## Aufgabe 2: Position hinzufügen

```ts
protected addToCart(): void {
  const workshop = WORKSHOPS.find((w) => w.id === this.selectedId())!;
  const quantity = this.quantity();
  this.items.update((items) =>
    items.some((item) => item.workshopId === workshop.id)
      ? items.map((item) =>
          item.workshopId === workshop.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      : [...items, { workshopId: workshop.id, title: workshop.title, price: workshop.price, quantity }],
  );
}
```

`map` und Spread liefern neue Arrays und Objekte; das Signal erkennt die Änderung an der neuen Referenz. Das vorgegebene `remove()` arbeitet genauso mit `filter`.

## Aufgabe 3: Ticketzahl und Zwischensumme

```ts
protected readonly ticketCount = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
protected readonly subtotal = computed(() =>
  this.items().reduce((sum, item) => sum + item.price * item.quantity, 0),
);
```

## Aufgabe 4: Rabatt und Summe

```ts
protected readonly discount = computed(() =>
  this.ticketCount() >= DISCOUNT_FROM_TICKETS ? Math.round(this.subtotal() * 0.1) : 0,
);
protected readonly total = computed(() => this.subtotal() - this.discount());
```

| Tickets | Zwischensumme | Rabatt | Summe |
| --- | --- | --- | --- |
| 2 | 580 € | 0 € | 580 € |
| 3 | 870 € | 87 € | 783 € |

## Aufgabe 5: `localStorage` per `effect`

```ts
function loadCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as CartItem[];
  } catch {
    return [];
  }
}

protected readonly items = signal<CartItem[]>(loadCart());

constructor() {
  effect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items()));
  });
}
```

`loadCart` steht außerhalb der Klasse über `@Component`. Der `effect` liest `items()` und läuft deshalb nach jeder Änderung erneut; beim ersten Lauf schreibt er den geladenen Stand zurück.

## Aufgabe 6: `linkedSignal`

```ts
protected readonly quantity = linkedSignal(() => {
  this.selectedId();
  return 1;
});
```

`linkedSignal` aus `@angular/core` importieren. Menge 4 einstellen, dann anderen Workshop wählen: Die Anzeige springt auf 1. Die Plus/Minus-Buttons funktionieren unverändert, weil `linkedSignal` wie ein `signal` `set` und `update` anbietet.

## Erweiterung

**Local Storage prüfen:** Eintrag `eventhub-cart` nach zwei Tickets „State Management mit NgRx“ und einem Ticket „Testen ohne Tränen“:

```json
[
  { "workshopId": 5, "title": "State Management mit NgRx", "price": 290, "quantity": 2 },
  { "workshopId": 7, "title": "Testen ohne Tränen", "price": 290, "quantity": 1 }
]
```

**Summe per `effect` (Gegenbeispiel):**

```ts
// Gegenbeispiel, nicht übernehmen
protected readonly totalCopy = signal(0);
constructor() {
  effect(() => this.totalCopy.set(this.subtotal() - this.discount()));
}
```

Die Anzeige stimmt meist, aber der Wert entsteht einen Schritt später als die Positionen, wird doppelt gehalten und kann durch Zugriffe zwischen Änderung und Effekt-Lauf veraltet gelesen werden. `computed` ist synchron, gecacht und hat genau eine Quelle der Wahrheit.

**Warenkorb leeren:**

```ts
protected clear(): void {
  this.items.set([]);
}
```

```html
<button class="btn" (click)="clear()" [disabled]="items().length === 0">Warenkorb leeren</button>
```
