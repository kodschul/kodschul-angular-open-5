# Komponenten-Deep-Dive-Cheatsheet

Schnellreferenz für Modul 3 (Control Flow, `@defer`, Direktiven und Host Directives). Stand: Angular 22.2.

## Control Flow (Lab 3.1)

| Syntax | Wirkung |
| --- | --- |
| `@if (cond) { … } @else if (b) { … } @else { … }` | bedingte Anzeige, ersetzt `*ngIf` + `<ng-template>` |
| `@if (sessions$ \| async; as sessions) { … }` | Ergebnis unter Namen speichern (nur in `@if`) |
| `@for (s of list; track s.id) { … }` | Schleife; `track` ist Pflicht |
| `@for (…) { … } @empty { … }` | Inhalt bei leerer Liste |
| `let i = $index, last = $last` | Kontextvariablen: `$index`, `$count`, `$first`, `$last`, `$even`, `$odd` |
| `@switch (x) { @case ('a') { … } @default { … } }` | Fallunterscheidung mit `===` |
| `@let total = list.length;` | schreibgeschützte Template-Variable |
| `npx ng generate @angular/core:control-flow --path <ordner>` | Migration von `*ngIf`/`*ngFor`/`ngSwitch` |

## `track` wählen

| Ausdruck | Wann |
| --- | --- |
| `track item.id` | Standard bei Daten mit ID |
| `track item` | Objekte bleiben dieselben Instanzen |
| `track $index` | statische Listen ohne Umordnung |
| NG0956 in der Konsole | Tracking auf Identität erzeugt die ganze Liste neu → ID nutzen |
| NG0955 in der Konsole | doppelte `track`-Werte |

## `@defer` (Lab 3.2)

| Syntax | Wirkung |
| --- | --- |
| `@defer { … }` | lädt bei `on idle` (Default) |
| `@defer (on viewport) { … }` | lädt, wenn der Placeholder sichtbar wird |
| `@defer (on interaction) { … }` | lädt bei Klick/Tastendruck auf den Placeholder |
| `@defer (on hover)` / `(on timer(2s))` / `(on immediate)` | bei Hover / nach Zeit / sofort, aber eigener Chunk |
| `@defer (when cond)` | lädt einmalig, sobald `cond` wahr ist |
| `@defer (on interaction; prefetch on hover)` | Code vorab laden, Anzeige erst beim Trigger |
| `@placeholder (minimum 500ms) { … }` | vor dem Trigger; genau ein Wurzelelement bei `viewport`/`interaction`/`hover` |
| `@loading (after 100ms; minimum 500ms) { … }` | während des Ladens, ohne Flackern |
| `@error { … }` | wenn der Chunk nicht lädt |

| Befehl | Wirkung |
| --- | --- |
| `npx ng build --verbose` | listet alle „Lazy chunk files“ mit Namen (z. B. `speaker-bio`) |
| `npx ng serve --no-hmr` | Dev-Server ohne HMR; `@defer`-Chunks laden erst beim Trigger |
| DevTools → Network → Filter `JS` | nachgeladene `chunk-….js` beobachten |

## Direktiven (Lab 3.3)

| Syntax | Wirkung |
| --- | --- |
| `@Directive({ selector: '[appHighlight]' })` | Attribut-Direktive (standalone ist Default) |
| `@Input('appHighlight') color = ''` | Eingabe mit dem Namen des Selektors |
| `host: { '(mouseenter)': 'show()' }` | Event am Host-Element |
| `host: { '[style.backgroundColor]': 'color' }` | Style binden |
| `host: { '[class.active]': 'active' }` | Klasse umschalten |
| `host: { '[attr.aria-describedby]': 'id' }` | Attribut binden (`null` entfernt es) |
| `host: { class: 'badge', tabindex: '0' }` | statische Klasse / statisches Attribut |
| `inject(ElementRef).nativeElement` | DOM-Element des Hosts |
| `inject(Renderer2)` | `createElement`, `appendChild`, `removeChild`, `setStyle`, `setAttribute` |

## Host Directives

| Syntax | Wirkung |
| --- | --- |
| `hostDirectives: [Highlight]` | Direktive immer anwenden, Eingaben nicht sichtbar |
| `hostDirectives: [{ directive: Highlight, inputs: ['appHighlight'] }]` | Eingabe unter Originalnamen freigeben |
| `{ directive: Highlight, inputs: ['appHighlight: color'] }` | Eingabe freigeben und umbenennen |
| `{ directive: X, outputs: ['changed: badgeChanged'] }` | Ausgabe freigeben und umbenennen |
| NG8002 `Can't bind to 'x'` | Eingabe nicht freigegeben |
| NG0309 `matches multiple times` | Direktive zusätzlich als Attribut gesetzt |
