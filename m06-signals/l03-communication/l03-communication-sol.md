# Lab 6.3 – Lösung: Session-Karte und Favoriten-Zähler mit Signals

Referenz: `src/app/examples/m06-signals/l03-communication/` (`session-card.ts`, `favorites.service.ts`, `favorites-header.ts`, `example.ts`), im Browser `/examples/m06-signals/l03-communication`.

## Aufgabe 1: Fehlerbild

Die Karten zeigen „★ Favorit“, der Header bleibt bei „★ 0 Favoriten“. Der Service zählt richtig, aber `FavoritesHeader` ist `OnPush` und wird nicht geprüft: Der Klick markiert nur die Karte und ihre Vorfahren (Seite, App), nicht den Header daneben. Ein normales Feld kann niemanden benachrichtigen.

## Aufgabe 2: `input()` und `output()`

```ts
@Component({
  selector: 'app-session-card',
  template: `
    <article class="card">
      <div class="row">
        <strong>{{ session().title }}</strong>
        <button class="btn" (click)="toggleFavorite()" [attr.aria-pressed]="favorite">
          {{ favorite ? '★ Favorit' : '☆ Merken' }}
        </button>
      </div>
      @if (!compact()) {
        <p>{{ session().abstract }}</p>
      }
      <p class="muted">{{ session().level }} · noch {{ seatsLeft() }} Plätze</p>
      <button class="btn" (click)="selected.emit(session())">Details</button>
    </article>
  `,
})
export class SessionCard {
  readonly session = input.required<Session>();
  readonly compact = input(false, { transform: booleanAttribute });
  @Input() favorite = false;
  @Output() favoriteChange = new EventEmitter<boolean>();
  readonly selected = output<Session>();

  protected readonly seatsLeft = computed(() => this.session().capacity - this.session().booked);

  protected toggleFavorite(): void {
    this.favorite = !this.favorite;
    this.favoriteChange.emit(this.favorite);
  }
}
```

Das Template der Seite bleibt gleich: `[session]`, `compact` und `(selected)` binden an Signal-APIs genauso wie an Decorators.

## Aufgabe 3: `model()`

```ts
export class SessionCard {
  readonly session = input.required<Session>();
  readonly compact = input(false, { transform: booleanAttribute });
  readonly favorite = model(false);
  readonly selected = output<Session>();

  protected readonly seatsLeft = computed(() => this.session().capacity - this.session().booked);

  protected toggleFavorite(): void {
    this.favorite.update((value) => !value);
  }
}
```

Im Karten-Template `favorite` durch `favorite()` ersetzen (zweimal). `model(false)` erzeugt Input `favorite` und Output `favoriteChange`; `update` schreibt den Wert und sendet das Ereignis. `[favorite]` und `(favoriteChange)` der Seite funktionieren unverändert. `EventEmitter`, `Input` und `Output` können aus dem Import entfernt werden, wenn der Service auch umgestellt ist.

## Aufgabe 4: Service mit Signals

```ts
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly ids = signal<number[]>([]);
  readonly favoriteIds = this.ids.asReadonly();
  readonly count = computed(() => this.ids().length);

  isFavorite(id: number): boolean {
    return this.ids().includes(id);
  }

  setFavorite(id: number, on: boolean): void {
    this.ids.update((ids) => (on ? (ids.includes(id) ? ids : [...ids, id]) : ids.filter((x) => x !== id)));
  }
}
```

```html
<span class="badge badge-ok">★ {{ favorites.count() }} Favoriten</span>
```

`favoriteIds` ist optional, zeigt aber das Muster: lesbar nach außen per `asReadonly()`, schreibbar nur über Methoden.

## Aufgabe 5: Zähler und Output `selected` prüfen

Drei Favoriten → „★ 3 Favoriten“, einen entfernen → „★ 2 Favoriten“, jeweils sofort. Der Header liest `count()`; Angular merkt sich diese Abhängigkeit und prüft den Header bei jeder Änderung von `ids`, obwohl er weder Input noch Ereignis bekommt.

„Zuletzt gewählt: RxJS-Operatoren, die wirklich zählen“ (je nach Karte). `output()` sendet mit `emit` wie ein `EventEmitter`; die Seite schreibt den Titel in das Signal `selectedTitle`.

## Erweiterung

```ts
// Seite
@Component({
  imports: [FavoritesHeader, SessionCard],
  template: `
    <div class="row">
      <input #filterBox placeholder="Titel filtern" (input)="filter.set(filterBox.value)" />
      <button class="btn" (click)="focusFilter()">Filter fokussieren</button>
      <span class="muted">{{ cardCount() }} Karten angezeigt</span>
    </div>
    @if (sessions().length) {
      <app-session-card [session]="sessions()[0]" [(favorite)]="featuredFavorite" />
      <p class="muted">Hervorgehoben gemerkt: {{ featuredFavorite() }}</p>
    }
    <!-- Liste wie bisher, aber über visibleSessions() -->
  `,
})
export class Playground {
  protected readonly filter = signal('');
  protected readonly visibleSessions = computed(() =>
    this.sessions().filter((s) => s.title.toLowerCase().includes(this.filter().toLowerCase())),
  );
  protected readonly featuredFavorite = signal(false);

  private readonly filterBox = viewChild.required<ElementRef<HTMLInputElement>>('filterBox');
  private readonly cards = viewChildren(SessionCard);
  protected readonly cardCount = computed(() => this.cards().length);

  protected focusFilter(): void {
    this.filterBox().nativeElement.focus();
  }
}
```

Imports ergänzen: `ElementRef`, `viewChild`, `viewChildren` aus `@angular/core`. `cardCount` zählt auch die hervorgehobene Karte mit. Die Zwei-Wege-Bindung hält `featuredFavorite` und `favorite` der Karte synchron; der Service erfährt davon nichts, weil kein `(favoriteChange)` an ihn bindet.
