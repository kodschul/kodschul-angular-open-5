# Lab 13.2: Optimieren und nachmessen

**Leitfragen:**

<details>
<summary>Welche Maßnahme bringt am meisten für den ersten sichtbaren Inhalt?</summary>

Die, die das LCP-Element schneller liefert: Im Messprotokoll aus Lab 13.1 ist das das Hero-Bild. Kleinere Datei, feste Abmessungen und hohe Ladepriorität wirken dort stärker als jede JavaScript-Optimierung.

</details>

<details>
<summary>Wie verhindert man, dass die App in drei Monaten wieder langsam ist?</summary>

Mit Grenzen, die automatisch prüfen: Budgets in `angular.json` lassen den Build scheitern, wenn das Start-Bundle wächst; die CI-Pipeline führt den Build bei jeder Änderung aus.

</details>

<details>
<summary>Lohnt sich eine Optimierung, die niemand messen kann?</summary>

Selten. Ohne Vorher-Wert lässt sich weder der Nutzen belegen noch ein Rückschritt erkennen. Ausnahme: Maßnahmen, die ohnehin sauberer Code sind, etwa `track` nach ID.

</details>

- Jede Maßnahme gehört zu einem Befund aus dem Messprotokoll und wird danach mit derselben Methode nachgemessen.
- Fast alle Werkzeuge sind aus früheren Labs bekannt; neu ist `NgOptimizedImage`.

## Maßnahmenkatalog

| Befund | Maßnahme | Bekannt aus | Wirkt auf |
| --- | --- | --- | --- |
| großes Bild ohne Abmessungen | passende Bildgröße, `NgOptimizedImage` mit `width`/`height`, `priority` | neu | LCP, CLS |
| schwere Komponente im Start-Bundle | `@defer (on viewport)` | Lab 3.2 | Initial-Bundle, TBT |
| ganze Seite im Start-Bundle | `loadComponent` / `loadChildren` | Lab 8.1 | Initial-Bundle |
| Liste wird bei jedem Neuladen komplett neu gebaut | `track item.id` statt `track item` | Lab 3.1 | TBT, INP |
| teure Methode im Template | Wert einmal in `computed()` berechnen | Lab 6.1 | TBT, INP |
| Komponente wird zu oft geprüft | `OnPush` (Default seit v22) statt `ChangeDetectionStrategy.Eager` | Lab 6.1 | INP |
| Bundle wächst unbemerkt | Budgets mit `maximumError` | Lab 13.1 | Regressionen |
| Platz springt beim Nachladen | Platzhalter mit fester Höhe (`@placeholder`, Lade-Skelett) | Lab 3.2 | CLS |

## Bilder mit `NgOptimizedImage`

`NgOptimizedImage` ist eine Direktive aus `@angular/common`. Sie ersetzt `src` durch `ngSrc` und erzwingt Angaben, die Browser für schnelles, stabiles Laden brauchen.

```ts
// Beispiel: Detailseite einer Session mit Banner (LCP-Bild) und Speaker-Porträt
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  template: `
    <img ngSrc="img/rooms/saal-a.webp" width="1200" height="400" priority
         alt="Saal A von der Bühne aus gesehen" class="banner" />
    <img ngSrc="img/speakers/anna-berger.webp" width="160" height="160"
         alt="Porträt von Anna Berger" />
  `,
  styles: `.banner { width: 100%; height: auto; }`,
})
```

`width` und `height` geben die echten Abmessungen der Datei an (Seitenverhältnis); die dargestellte Größe regelt CSS. Das Banner ist das LCP-Element und bekommt `priority`, das Porträt weiter unten lädt lazy.

| Attribut | Wirkung |
| --- | --- |
| `ngSrc` | Bildpfad; die Direktive setzt `src` selbst |
| `width`, `height` | Pflicht (oder `fill`); der Browser reserviert Platz im Seitenverhältnis → kein CLS |
| `priority` | für das LCP-Bild: setzt `fetchpriority="high"` und `loading="eager"` |
| ohne `priority` | Bilder laden standardmäßig mit `loading="lazy"` |
| `fill` | Bild füllt den Elterncontainer, wenn die Größe unbekannt ist |
| `ngSrcset`, `sizes` | responsive Varianten; brauchen einen Image-Loader (z. B. für ein Bild-CDN) |

Im Entwicklungsmodus warnt Angular bei typischen Fehlern, etwa `NG0913` (Datei viel größer als dargestellt) oder `NG02955`, wenn das LCP-Bild kein `priority` hat. Die Direktive verkleinert keine Dateien: Die passende Größe und ein effizientes Format (WebP, AVIF) entstehen beim Export oder im Bild-CDN.

## Schwere Komponente verzögern

```html
<!-- Beispiel: Lageplan mit einer großen Kartenbibliothek am Ende der Seite -->
@defer (on viewport; prefetch on idle) {
  <app-venue-map />
} @placeholder {
  <div class="map-box">Lageplan wird beim Scrollen geladen …</div>
} @loading (minimum 200ms) {
  <div class="map-box loading">Lageplan wird geladen …</div>
}
<!-- styles: .map-box { height: 400px; }  gleiche Höhe wie die Karte -->
```

- `on viewport` lädt den Chunk, wenn der Platzhalter sichtbar wird; `prefetch on idle` holt ihn vorher, sobald der Browser nichts zu tun hat.
- Komponente und alles, was nur sie importiert (hier die Kartenbibliothek), wandern in einen eigenen Lazy-Chunk. Wird die Komponente zusätzlich an anderer Stelle direkt verwendet, bleibt der Code im Start-Bundle.
- Platzhalter und Ladezustand haben dieselbe Höhe wie die Komponente; sonst entsteht ein neuer Layout-Sprung.

## Teure Berechnung aus dem Template holen

Eine Methode im Template läuft bei jedem Change-Detection-Durchlauf für jede Zeile erneut. Ein `computed()` berechnet den Wert einmal pro Datenstand; das Template liest nur noch fertige Werte. Beispiel: geschätzte Lesezeit der Abstracts in einer Vortragsliste.

```html
<!-- vorher: readingTime() läuft pro Zeile und pro Durchlauf, track nach Objekt -->
@for (talk of talks(); track talk) {
  <li>{{ talk.title }} · {{ readingTime(talk.abstract) }} min</li>
}
```

```ts
// nachher: einmal pro Datenstand; readingTime() ist eine Funktion außerhalb der Klasse
private readonly rows = computed(() =>
  this.talks().map((talk) => ({ talk, minutes: readingTime(talk.abstract) })),
);
readonly shortRows = computed(() => this.rows().filter((row) => row.minutes <= this.maxMinutes()));
```

```html
@for (row of shortRows(); track row.talk.id) {
  <li>{{ row.talk.title }} · {{ row.minutes }} min</li>
}
```

- `rows` rechnet nur neu, wenn sich `talks` ändert; ein Wechsel von `maxMinutes` filtert nur noch, ohne die Lesezeiten neu zu berechnen.
- `track row.talk.id` erkennt Zeilen nach dem Neuladen wieder; Angular aktualisiert nur geänderte Bindungen, statt alle Zeilen neu zu bauen. `track talk` (nach Objekt) baut nach jedem Neuladen alles neu, weil die API neue Objekte liefert; im Entwicklungsmodus warnt Angular dann mit `NG0956`.
- Alternative ohne Signals: eine reine Pipe (`pure: true`, Default) mit dem Wert; sie läuft nur, wenn sich ihr Eingabewert ändert.

## Budgets als Leitplanke

Budgets knapp über den gemessenen Werten setzen. Warnung = Hinweis im Build, Fehler = Build bricht ab. Beispiel für eine App, die nach der Optimierung 410 kB Initial total hat:

```json
"budgets": [
  { "type": "initial", "maximumWarning": "450kB", "maximumError": "600kB" },
  { "type": "anyScript", "maximumWarning": "300kB", "maximumError": "450kB" },
  { "type": "anyComponentStyle", "maximumWarning": "3kB", "maximumError": "6kB" }
]
```

Ein neues Angular-22-Projekt startet mit `initial` 500 kB / 1 MB und `anyComponentStyle` 4 kB / 8 kB.

Budgets messen die Rohgröße (Raw size), nicht die übertragene, komprimierte Größe.

## Nachmessen

Gleiche Bedingungen wie in Lab 13.1: Produktions-Build, statischer Server, Inkognito, drei Läufe, Median. Die Lösung liegt als zweite App in `workspaces/eventhub-perf-fixed/` (Port 8082), damit beide Varianten nebeneinander messbar sind.

```bash
git diff --no-index workspaces/eventhub-perf/src workspaces/eventhub-perf-fixed/src
```

## Ausblick: SSR und Hydration

Server-Side Rendering (`ng add @angular/ssr`) liefert fertiges HTML aus, Hydration übernimmt es im Browser ohne Neuaufbau. Das verbessert vor allem FCP und LCP bei langsamen Geräten und hilft Suchmaschinen. Im Kurs nur Ausblick.

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| Konsole: `NG02954` „required attributes are missing“ | `width`/`height` fehlen und kein `fill` | beide Attribute setzen |
| Bild verzerrt, Konsole: `NG02952` zum Seitenverhältnis | `width`/`height` passen nicht zum Seitenverhältnis der Datei | echte Abmessungen eintragen, CSS `height: auto` |
| Diagramm lädt sofort trotz `@defer` | Platzhalter ohne Höhe liegt direkt im sichtbaren Bereich | Platzhalter mit fester Höhe; Liste mit Lade-Skelett |
| `chart.js` weiter im Initial-Bundle | `BookingChart` noch an anderer Stelle direkt im Template oder per TypeScript-Import genutzt | alle direkten Verwendungen in `@defer` legen |
| Build bricht mit „budget … exceeded“ ab | Budget zu knapp oder Bundle gewachsen | Ursache in der Bundle-Analyse suchen, Budget nur bewusst anheben |

## Fazit

- Das LCP-Bild bringt den größten Einzeleffekt: richtige Dateigröße, feste Abmessungen, `priority`.
- `@defer`, `computed()` und `track` nach ID sind bekannte Werkzeuge mit messbarer Wirkung.
- Budgets halten den erreichten Stand fest.

In der Übung werden die drei Befunde behoben und die Vorher/Nachher-Tabelle erstellt.
