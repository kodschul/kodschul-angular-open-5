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
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  template: `
    <img ngSrc="img/hero.png" width="1400" height="700" priority
         alt="Bühne der EventHub-Konferenz mit drei Scheinwerfern" class="hero" />
  `,
  styles: `.hero { width: 100%; height: auto; }`,
})
```

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
@defer (on viewport; prefetch on idle) {
  <app-booking-chart />
} @placeholder {
  <div class="card"><div class="chart-placeholder">Diagramm wird beim Scrollen geladen …</div></div>
} @loading (minimum 200ms) {
  <div class="card"><div class="chart-placeholder loading">Diagramm wird geladen …</div></div>
}
```

- `on viewport` lädt den Chunk, wenn der Platzhalter sichtbar wird; `prefetch on idle` holt ihn vorher, sobald der Browser nichts zu tun hat.
- Komponente und alles, was nur sie importiert (hier `chart.js`), wandern in einen eigenen Lazy-Chunk.
- Platzhalter und Ladezustand haben dieselbe Höhe wie das Diagramm; sonst entsteht ein neuer Layout-Sprung.

## Teure Berechnung aus dem Template holen

Vorher ruft das Template `relevance(session)` dreimal pro Karte und bei jedem Durchlauf auf. Nachher berechnet ein `computed()` den Score einmal pro Datenstand; das Template liest nur noch Werte.

```ts
private readonly scored = computed(() => {
  const list = this.sessions.hasValue() ? this.sessions.value() : [];
  return list.map((session) => ({ session, score: relevance(session) }));
});

readonly filtered = computed(() => {
  const term = this.query().toLowerCase();
  return this.scored().filter((item) => item.session.title.toLowerCase().includes(term));
});
```

```html
@for (item of filtered(); track item.session.id) {
  <article class="card" [class.score-high]="item.score > 50">…</article>
}
```

- `computed()` rechnet nur neu, wenn sich `sessions` ändert, nicht bei jedem Tick der Uhr und nicht bei jeder Eingabe.
- `track item.session.id` erkennt Karten nach dem Neuladen wieder; Angular aktualisiert nur geänderte Bindungen statt 12 Karten neu zu bauen.
- Alternative ohne Signals: eine reine Pipe (`pure: true`, Default) mit dem Score; sie läuft nur, wenn sich ihr Eingabewert ändert.

## Budgets als Leitplanke

Budgets knapp über den gemessenen Werten setzen. Warnung = Hinweis im Build, Fehler = Build bricht ab.

```json
"budgets": [
  { "type": "initial", "maximumWarning": "350kB", "maximumError": "500kB" },
  { "type": "anyScript", "maximumWarning": "250kB", "maximumError": "400kB" },
  { "type": "anyComponentStyle", "maximumWarning": "2kB", "maximumError": "4kB" }
]
```

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
