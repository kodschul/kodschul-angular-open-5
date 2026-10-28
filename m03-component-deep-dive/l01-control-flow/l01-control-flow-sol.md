# Lab 3.1 – Lösung: Control Flow Syntax

Referenz: `src/app/examples/m03-component-deep-dive/l01-control-flow/example.ts` (Pipe in `session-sort.pipe.ts`), im Browser `/examples/m03-component-deep-dive/l01-control-flow`.

## Aufgabe 1: Starter kopieren

Nach dem Kopieren zeigt `/playground` zwölf Sessions, A–Z sortiert, beginnend mit „Angular heute: Standalone, Signals und zoneless“. Die Suche filtert beim Tippen, „Sortierung“ schaltet auf Z–A.

## Aufgaben 2–5: Template umstellen

Vollständiges Template in `src/app/playground/playground.ts`:

```ts
template: `
  <h1>Sessions</h1>
  <div class="row">
    <input #search placeholder="Suche im Titel" (input)="term = search.value" />
    <button class="btn" (click)="descending = !descending">Sortierung: {{ descending ? 'Z–A' : 'A–Z' }}</button>
  </div>

  @if (sessions$ | async; as sessions) {
    @let visible = sessions | sessionSort: term : descending;
    <p class="muted">{{ visible.length }} von {{ sessions.length }} Sessions</p>

    @for (session of visible; track session.id) {
      <div class="card">
        <div class="row">
          <strong>{{ session.title }}</strong>
          @switch (session.level) {
            @case ('Einsteiger') {
              <span class="badge badge-ok">Einsteiger</span>
            }
            @case ('Fortgeschritten') {
              <span class="badge badge-warn">Fortgeschritten</span>
            }
            @default {
              <span class="badge badge-error">{{ session.level }}</span>
            }
          }
        </div>
        <p class="muted">
          {{ session.start | date: 'EEE, HH:mm' }} · {{ session.room }} ·
          {{ session.speaker?.name ?? 'Speaker folgt' }}
        </p>
        <input placeholder="Eigene Notiz zur Session" />
      </div>
    } @empty {
      <p class="muted">Keine Session passt zu „{{ term }}“.</p>
    }
  } @else {
    <p class="loading">Lade Sessions …</p>
  }
`,
```

- `@let visible` ersetzt die drei Aufrufe der Pipe im Starter durch einen.
- `@empty` ersetzt das innere `*ngIf … else empty` samt `<ng-template #empty>`.

## Aufgabe 6: Imports

```ts
import { AsyncPipe, DatePipe } from '@angular/common';
// …
imports: [AsyncPipe, DatePipe, SessionSortPipe],
```

Bleibt ein `*ngIf` im Template stehen, nachdem `NgIf` entfernt wurde, meldet der Compiler NG8103 („The `*ngIf` directive was used in the template, but neither the `NgIf` directive nor the `CommonModule` was imported …“) als Warnung, nicht als Fehler: Der Build läuft durch, der Inhalt unter dem `*ngIf` fehlt im Browser ohne weitere Meldung. Deshalb die Build-Ausgabe auf Warnungen prüfen.

## Aufgabe 7: `@empty`

Suche `xyz`: Anzeige „0 von 12 Sessions“ und „Keine Session passt zu „xyz““.

## Aufgabe 8: `track` im Vergleich

| Ausdruck | Notiz „Merken“ bei „Angular heute …“, dann Klick auf Sortierung |
| --- | --- |
| `track session.id` | Die Karte „Angular heute …“ steht jetzt unten, die Notiz steht in ihr. Angular hat das DOM-Element verschoben. |
| `track $index` | Oben steht jetzt „Testen ohne Tränen“, die Notiz „Merken“ steht in deren Feld. Angular hat das erste Element behalten und nur Titel und Badge neu befüllt. |

Begründung: Das Notizfeld ist nicht an Daten gebunden, sein Inhalt lebt nur im DOM. Nur ein Schlüssel, der zur Session gehört, hält DOM und Daten zusammen.

## Erweiterung

Schematic auf den Starter angewendet (Angular 22.2, Stand: 28.10.2026), Ausschnitt:

```html
@if ((sessions | sessionSort: term : descending).length > 0) {
  @for (session of sessions | sessionSort: term : descending; track session) {
    …
  }
} @else {
  <p class="muted">Keine Session passt zu „{{ term }}“.</p>
}
```

- `track session` statt `track session.id`, kein `@empty`, kein `@let`.
- `imports` enthält nur noch `AsyncPipe`, `DatePipe`, `SessionSortPipe`.

Nummer und Listenende:

```html
@for (session of visible; track session.id; let i = $index, last = $last) {
  <div class="card">
    <span class="muted">#{{ i + 1 }}</span> <strong>{{ session.title }}</strong>
  </div>
  @if (last) {
    <p class="muted">Ende der Liste</p>
  }
}
```
