# Lab 1.2 – Lösung: Fix the EventHub

## Aufgabe 1: Starter kopieren

`src/app/playground/` enthält danach `playground.ts` und den Ordner `m01-l02-fix-the-eventhub/` mit `favorites.service.ts`, `session-card.ts`, `session-detail.ts`. Der Build in Terminal 2 schlägt fehl; das ist der Ausgangszustand.

## Aufgabe 2: Fehlerliste

Vorlage als Kommentar:

```ts
// Nr. | Symptom | Ursache | Fix
```

Die ausgefüllte Liste steht bei Aufgabe 7.

## Aufgabe 3: Build-Fehler

Erste Ausgabe (gekürzt):

```text
src/app/playground/m01-l02-fix-the-eventhub/session-card.ts:12:43 - error NG8004: No pipe found with name 'date'.
src/app/playground/playground.ts:26:11 - error NG8001: 'app-session-card' is not a known element
src/app/playground/playground.ts:28:13 - error NG8002: Can't bind to 'isFavorite' since it isn't a known property of 'app-session-card'.
src/app/playground/playground.ts:29:48 - error TS2345: Argument of type 'Event' is not assignable to parameter of type 'number'.
```

`NG8002` und `TS2345` sind Folgefehler von `NG8001`: Angular kennt `app-session-card` nicht und hält es für ein normales HTML-Element.

**Fix 1 – fehlender Import** (`playground.ts`, Template-Problem):

```ts
imports: [AsyncPipe, SessionCard, SessionDetail],
```

**Fix 3 – Pipe ohne Import** (`session-card.ts`, Template-Problem):

```ts
import { DatePipe } from '@angular/common';
// …
imports: [DatePipe, RouterLink],
```

Danach erscheint eine neue Meldung:

```text
src/app/playground/playground.ts:27:13 - error TS2322: Type 'string' is not assignable to type 'Session'.
```

**Fix 2 – falsches Binding** (`playground.ts`, Template-Problem):

```html
<app-session-card
  [session]="session"
  [isFavorite]="favorites.has(session.id)"
  (toggleFavorite)="favorites.toggle($event)"
/>
```

Ohne eckige Klammern wird der Text `"session"` übergeben.

## Aufgabe 4: Laufzeitfehler

Die Seite bleibt leer, die Konsole meldet `NG0201: No provider found for …FavoritesService` (der Klassenname kann im Entwicklungs-Build mit `_` beginnen).

**Fix 4 – Service nicht bereitgestellt** (`favorites.service.ts`, DI-Problem):

```ts
@Injectable({ providedIn: 'root' })
export class FavoritesService {
```

Alternative: `providers: [FavoritesService]` im `@Component` von `Playground`; dann gilt die Instanz nur für diese Komponente und ihre Kinder.

## Aufgabe 5: Details öffnen

**Fix 5 – Link ohne Routen-Parameter** (`session-card.ts`, Template-Problem):

```html
<a [routerLink]="[]" [queryParams]="{ id: session.id }">Details</a>
```

`[routerLink]="[]"` bleibt auf der aktuellen Route (`/playground`), `queryParams` hängt `?id=3` an. `withComponentInputBinding()` aus `app.config.ts` schreibt den Wert in `@Input() id` von `Playground`; `@if (id)` zeigt dann `app-session-detail`. „Schließen“ nutzt `[routerLink]="[]"` ohne `queryParams` und entfernt den Parameter.

## Aufgabe 6: Merken

**Fix 6 – Event nicht weitergegeben** (`session-card.ts`, Klassen-Problem):

```ts
onFavorite(): void {
  this.toggleFavorite.emit(this.session.id);
}
```

Der Klick lief bisher nur bis `console.log`. Mit `emit` ruft das Eltern-Template `favorites.toggle($event)` auf. Weil der Handler im Template von `Playground` läuft, prüft Angular die Ansicht danach neu: Zähler und Stern aktualisieren sich auch zoneless.

## Aufgabe 7: Fehlerliste

| Nr. | Symptom | Ursache | Fix | Art |
| --- | --- | --- | --- | --- |
| 1 | `NG8001 'app-session-card' is not a known element` (+ Folgefehler) | `SessionCard` fehlt in `imports` | in `imports` eintragen | Template |
| 2 | `TS2322 Type 'string' is not assignable to type 'Session'` | `session="session"` übergibt Text | `[session]="session"` | Template |
| 3 | `NG8004 No pipe found with name 'date'` | `DatePipe` fehlt in `imports` | `DatePipe` importieren | Template |
| 4 | Seite leer, `NG0201 No provider found` | `@Injectable()` ohne `providedIn` | `providedIn: 'root'` | DI |
| 5 | „Details“ ändert nichts | Link ohne Parameter | `[queryParams]="{ id: session.id }"` | Template/Routing |
| 6 | „Merken“ ohne Wirkung | `emit` fehlt | `this.toggleFavorite.emit(this.session.id)` | Klasse |

## Aufgabe 8: Vergleich

Referenz-App: `src/app/examples/m01-angular-recap/l02-recap/` (`example.ts`, `session-card.ts`, `session-detail.ts`, `favorites.service.ts`), URL `/examples/m01-angular-recap/l02-recap`. Die reparierte Karte vollständig:

```ts
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Session } from '../../shared/models';

@Component({
  selector: 'app-session-card',
  imports: [DatePipe, RouterLink],
  template: `
    <div class="card">
      <strong>{{ session.title }}</strong>
      <p class="muted">{{ session.start | date: 'dd.MM.yyyy, HH:mm' }} · {{ session.room }}</p>
      <div class="row">
        <a [routerLink]="[]" [queryParams]="{ id: session.id }">Details</a>
        <button class="btn" (click)="onFavorite()">{{ isFavorite ? '★ Gemerkt' : '☆ Merken' }}</button>
      </div>
    </div>
  `,
})
export class SessionCard {
  @Input({ required: true }) session!: Session;
  @Input() isFavorite = false;
  @Output() toggleFavorite = new EventEmitter<number>();

  onFavorite(): void {
    this.toggleFavorite.emit(this.session.id);
  }
}
```

## Erweiterung

**Zusatzfehler 1 – Datumsformat:** Die Karte zeigt bei Session 1 `10.03.2027, 09:03` statt `09:30`. `MM` ist der Monat (März = 03), Minuten heißen `mm`:

```html
{{ session.start | date: 'dd.MM.yyyy, HH:mm' }}
```

**Zusatzfehler 2 – Detail wechselt nicht:** Die URL wechselt auf `?id=5`, der Titel bleibt bei der ersten Session. `SessionDetail` lädt in `ngOnInit`; die Komponente bleibt bestehen (`@if (id)` ist weiter wahr), nur das `@Input` ändert sich. Fix in `session-detail.ts`:

```ts
export class SessionDetail implements OnChanges {
  // …
  ngOnChanges(): void {
    this.session$ = this.api.getSession(Number(this.sessionId));
  }
}
```

`OnInit` im Import durch `OnChanges` ersetzen.
