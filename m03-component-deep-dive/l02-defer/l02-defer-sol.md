# Lab 3.2 – Lösung: Deferred Loading

Referenz: `src/app/examples/m03-component-deep-dive/l02-defer/` (`example.ts`, `speaker-bio.ts`, `session-comments.ts`), im Browser `/examples/m03-component-deep-dive/l02-defer`. Das Beispiel enthält beim Kommentarbereich zusätzlich `prefetch on hover` aus der Erweiterung; Aufgabe 4 kommt ohne aus.

## Aufgabe 1: Starter kopieren

Ordnerstruktur danach:

```text
src/app/playground/
├── playground.ts                 # Inhalt aus starters/m03-l02-defer.ts
└── m03-l02-defer/
    ├── speaker-bio.ts
    └── session-comments.ts
```

`playground.ts` importiert die beiden Komponenten über `./m03-l02-defer/…`; deshalb muss der Ordnername genau stimmen.

## Aufgabe 2: Ausgangslage

Ohne `@defer` lädt der Browser beim Öffnen von `/playground` alle JS-Dateien auf einmal, darunter den Chunk der Playground-Route mit Seite, Speaker-Profil und Kommentaren. Beim Scrollen kommt nichts dazu.

## Aufgaben 3 und 4: `@defer`-Blöcke

Ausschnitt aus dem Template in `src/app/playground/playground.ts` (Rest unverändert):

```html
<h2>Speaker</h2>
@defer (on viewport) {
  <app-speaker-bio [speaker]="session.speaker" />
} @placeholder {
  <p class="muted">Das Speaker-Profil lädt, sobald dieser Bereich sichtbar wird.</p>
} @loading (after 100ms; minimum 500ms) {
  <p class="loading">Lade Speaker-Profil …</p>
} @error {
  <p class="error">Speaker-Profil konnte nicht geladen werden.</p>
}

<h2>Kommentare</h2>
@defer (on interaction) {
  <app-session-comments [sessionId]="session.id" />
} @placeholder {
  <button class="btn">Kommentare anzeigen</button>
} @loading (minimum 500ms) {
  <p class="loading">Lade Kommentare …</p>
}
```

- Die Import-Zeilen und `imports: [AsyncPipe, DatePipe, SpeakerBio, SessionComments]` bleiben unverändert; der Compiler macht aus den statischen Imports dynamische.
- Jeder Placeholder hat genau ein Wurzelelement (`<p>` bzw. `<button>`), weil `on viewport` und `on interaction` dieses Element beobachten.

## Aufgabe 5: Network-Tab

| Aktion | Neue JS-Datei |
| --- | --- |
| Seite laden | Chunk der Playground-Route, ohne Speaker-Profil und Kommentare |
| Zum Speaker-Bereich scrollen | `chunk-….js` mit `SpeakerBio` |
| Klick auf „Kommentare anzeigen“ | `chunk-….js` mit `SessionComments` |

Ein Wechsel auf Session 5 oder 9 lädt keine weitere JS-Datei: Der Chunk ist schon im Browser. Die Bereiche starten trotzdem wieder beim Placeholder: Das neue `session$` liefert zuerst noch keinen Wert, die `async`-Pipe gibt `null` aus, `@if` baut den Inhalt neu auf. Speaker-Profil und Kommentare erscheinen erst, wenn der Trigger erneut eintritt (Scrollen bzw. Klick), dann ohne Ladezeit.

## Aufgabe 6: Drosselung

Mit „Slow 4G“ steht nach dem Scrollen für mindestens 500 ms „Lade Speaker-Profil …“, nach dem Klick „Lade Kommentare …“. Ohne Drosselung erscheint der Ladezustand meist gar nicht, weil `after 100ms` ihn erst nach 100 ms einblendet.

## Aufgabe 7: Build-Ausgabe

```bash
npx ng build --verbose
```

```text
Lazy chunk files             | Names               |  Raw size | Estimated transfer size
…
chunk-6LqOH6yR.js            | session-comments    |   1.38 kB |               758 bytes
chunk-BuFjHlZz.js            | speaker-bio         | 742 bytes |               742 bytes
…
```

Hashes und Größen weichen ab. Weil das Beispiel unter `examples/` dieselben Komponenten-Dateinamen nutzt, erscheinen `speaker-bio` und `session-comments` zweimal: einmal für das Beispiel, einmal für den Playground.

## Erweiterung

Prefetch:

```html
@defer (on interaction; prefetch on hover) {
  <app-session-comments [sessionId]="session.id" />
} @placeholder {
  <button class="btn">Kommentare anzeigen</button>
}
```

Der Chunk lädt beim Darüberfahren; der Klick zeigt die Kommentare ohne Ladezustand.

Eigene Bedingung mit `when`:

```ts
// in der Klasse
showComments = false;
```

```html
<button class="btn" (click)="showComments = true">Kommentare laden</button>
@defer (when showComments) {
  <app-session-comments [sessionId]="session.id" />
} @placeholder {
  <p class="muted">Kommentare noch nicht geladen.</p>
}
```

Das Feld ändert sich durch einen Klick im Template; das reicht, damit die Ansicht ohne Zone.js neu geprüft wird.

Fehlerfall: Mit gesperrter Chunk-URL zeigt der Speaker-Bereich nach dem Scrollen „Speaker-Profil konnte nicht geladen werden.“.
