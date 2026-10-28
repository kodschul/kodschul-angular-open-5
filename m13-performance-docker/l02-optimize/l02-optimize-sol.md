# Lab 13.2 – Lösung: Optimieren und nachmessen

Fertiger Stand: `output/project/workspaces/eventhub-perf-fixed/` (Angular-Projektname bleibt `eventhub-perf`, Build in `dist/eventhub-perf/browser`). Info-Seite in der Kurs-App: `/examples/m13-performance-docker/l02-optimize`.

Alle Unterschiede auf einen Blick (im Ordner `output/project/`):

```bash
git diff --no-index workspaces/eventhub-perf/src workspaces/eventhub-perf-fixed/src
git diff --no-index workspaces/eventhub-perf/angular.json workspaces/eventhub-perf-fixed/angular.json
```

## Aufgabe 1: Bild in passender Größe

```json
"hero": "node scripts/generate-hero.mjs --width 1400 --height 700 --noise 0 --force",
```

```text
Hero-Bild erzeugt: public/img/hero.png (1400x700, 0.0 MB)
```

Die Datei schrumpft von 4,7 MB auf rund 50 KB: 1400 Pixel Breite reichen für die maximale Darstellungsbreite von ca. 1050 Pixeln, ein glatt exportiertes Bild komprimiert viel besser als eines mit Rauschen. In echten Projekten entsteht diese Datei beim Bildexport (WebP oder AVIF) oder in einem Bild-CDN.

## Aufgabe 2 und 3: `NgOptimizedImage` und `@defer`

`src/app/home/home.ts`:

```ts
import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { BookingChart } from '../stats/booking-chart';
import { SessionList } from '../sessions/session-list';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, SessionList, BookingChart],
  template: `
    <img
      ngSrc="img/hero.png"
      width="1400"
      height="700"
      priority
      alt="Bühne der EventHub-Konferenz mit drei Scheinwerfern"
      class="hero"
    />
    <section class="hero-text">
      <h1>EventHub Konferenz 2027</h1>
      <p class="muted">Drei Tage Angular, Architektur und Testing. Programm, Speaker und Anmeldung an einem Ort.</p>
    </section>

    <h2>Programm</h2>
    <app-session-list />

    <h2>Auslastung</h2>
    @defer (on viewport; prefetch on idle) {
      <app-booking-chart />
    } @placeholder {
      <div class="card"><div class="chart-placeholder muted">Diagramm wird beim Scrollen geladen …</div></div>
    } @loading (minimum 200ms) {
      <div class="card"><div class="chart-placeholder loading">Diagramm wird geladen …</div></div>
    }
  `,
  styles: `
    .hero { display: block; width: 100%; height: auto; border-radius: 8px; }
    .chart-placeholder { height: 320px; } /* gleiche Höhe wie das Diagramm: kein Layout-Sprung */
  `,
})
export class Home {}
```

- `BookingChart` bleibt in `imports`: Steht eine Komponente nur innerhalb von `@defer`, lagert der Compiler sie trotzdem in einen eigenen Chunk aus.
- Das Diagramm selbst hat in beiden Varianten eine feste Höhe (`.chart-box { height: 320px }` in `booking-chart.ts`, `maintainAspectRatio: false`).

## Aufgabe 4 bis 6: Liste ohne teure Template-Aufrufe

`src/app/sessions/session-list.ts`:

```ts
import { httpResource } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventHubConfigService } from '../config';
import { Session } from '../session';

interface SessionView {
  session: Session;
  score: number;
}

@Component({
  selector: 'app-session-list',
  imports: [RouterLink],
  template: `
    <div class="row">
      <input #search placeholder="Sessions durchsuchen" (input)="query.set(search.value)" />
      <span class="muted">Live-Auslastung · aktualisiert vor {{ secondsSinceRefresh() }} s</span>
    </div>

    @if (sessions.hasValue()) {
      <div class="grid" style="margin-top: 1rem">
        @for (item of filtered(); track item.session.id) {
          <article class="card" [class.score-high]="item.score > 50" [class.score-low]="item.score <= 50">
            <h3><a [routerLink]="['/sessions', item.session.id]">{{ item.session.title }}</a></h3>
            <p class="muted">{{ item.session.track }} · {{ item.session.room }} · {{ item.session.durationMin }} min</p>
            <span class="badge">Empfehlung {{ item.score }} %</span>
            <span class="badge">{{ item.session.capacity - item.session.booked }} Plätze frei</span>
          </article>
        } @empty {
          <p class="muted">Keine Session passt zur Suche.</p>
        }
      </div>
    } @else if (sessions.error()) {
      <p class="error">Programm konnte nicht geladen werden. Läuft die Mock-API (npm run api)?</p>
    } @else {
      <p class="loading list-skeleton">Programm wird geladen …</p>
    }
  `,
  styles: `
    .list-skeleton { min-height: 1200px; }
  `,
})
export class SessionList {
  private readonly config = inject(EventHubConfigService).config;

  readonly query = signal('');
  readonly sessions = httpResource<Session[]>(() => `${this.config.apiUrl}/sessions`);

  /** Läuft nur, wenn neue Daten kommen – nicht bei jedem Tick und nicht bei jeder Eingabe. */
  private readonly scored = computed<SessionView[]>(() => {
    const list = this.sessions.hasValue() ? this.sessions.value() : [];
    return list.map((session) => ({ session, score: relevance(session) }));
  });

  readonly filtered = computed(() => {
    const term = this.query().toLowerCase();
    return this.scored().filter((item) => item.session.title.toLowerCase().includes(term));
  });

  private readonly now = signal(Date.now());
  private readonly lastRefresh = signal(Date.now());
  readonly secondsSinceRefresh = computed(() => Math.round((this.now() - this.lastRefresh()) / 1000));

  constructor() {
    const tick = setInterval(() => this.now.set(Date.now()), 1000);
    const refresh = setInterval(() => {
      this.sessions.reload();
      this.lastRefresh.set(Date.now());
    }, 10_000);
    inject(DestroyRef).onDestroy(() => {
      clearInterval(tick);
      clearInterval(refresh);
    });
  }
}

function relevance(session: Session): number {
  let score = 0;
  for (let i = 0; i < 100_000; i++) {
    score += Math.sqrt(i % (session.id + 7)) * Math.sin(i);
  }
  return Math.round(Math.abs(score) % 100);
}
```

- Pro Datenstand 12 Aufrufe statt 36 pro Durchlauf; Tippen und Uhr lösen keine Berechnung mehr aus.
- `relevance` als Funktion außerhalb der Klasse: Das Template kann sie nicht mehr versehentlich aufrufen.
- Uhr und Neuladen bleiben bewusst erhalten: Sie sind fachlich gewollt und jetzt billig.

## Aufgabe 7: Budgets

```json
"budgets": [
  { "type": "initial", "maximumWarning": "350kB", "maximumError": "500kB" },
  { "type": "anyComponentStyle", "maximumWarning": "2kB", "maximumError": "4kB" },
  { "type": "anyScript", "maximumWarning": "250kB", "maximumError": "400kB" }
]
```

`initial` liegt etwa 20 % über dem gemessenen Wert (288 kB), `anyScript` über dem größten Lazy-Chunk (`booking-chart`, 207 kB). Würde `chart.js` versehentlich wieder ins Start-Bundle wandern, erreicht `initial` rund 475 kB und der Build warnt.

## Aufgabe 8: Build-Ausgabe

```text
Initial chunk files | Names          |  Raw size | Estimated transfer size
chunk-HAFNJ5OF.js   | -              | 182.71 kB |                54.06 kB
chunk-E4EKP6NR.js   | -              |  98.60 kB |                25.11 kB
main-QDO6YXOM.js    | main           |   4.85 kB |                 2.02 kB
styles-Z3QJSWY5.css | styles         |   1.96 kB |               705 bytes

                    | Initial total  | 288.12 kB |                81.89 kB

Lazy chunk files    | Names          |  Raw size | Estimated transfer size
chunk-6SHBKPXO.js   | booking-chart  | 206.83 kB |                61.76 kB
chunk-WYLU5P7Y.js   | session-detail |   1.43 kB |               696 bytes
```

`session-detail` erscheint nur mit der Erweiterung (Lazy Route). Die Aufteilung in `chunk-…` und `main-…` entsteht, weil Angular und App-Code jetzt von mehreren Chunks gemeinsam genutzt werden.

## Aufgabe 9: Vorher/Nachher

Gemessen am 28.10.2026 (Apple-Silicon-Laptop, Lighthouse 13.6 CLI, Mobil-Profil, Median aus drei Läufen). Eigene Werte weichen ab; die Richtung ist dieselbe.

| Kennzahl | Vorher (Median) | Nachher (Median) | Maßnahme |
| --- | --- | --- | --- |
| Performance-Score | 29 | 93 | alle |
| FCP | 0,7 s | 0,6 s | kaum verändert: Text war schon früh da |
| LCP | 26,4 s | 2,1 s | Bildgröße, `priority` |
| TBT | 4.660 ms | 290 ms | `computed()`, `track`, `@defer` |
| CLS | 0,385 | 0 | `width`/`height`, Platzhalter mit fester Höhe |
| Initial total (raw) | 474 kB | 288 kB | `@defer` für `chart.js` |
| Übertragene Daten | ca. 5 MB | 225 KiB | Bildgröße, `@defer` |

Desktop-Profil (je ein Lauf): Score 48 → 100, LCP 4,4 s → 0,7 s, TBT 380 ms → 0 ms, CLS 0,248 → 0.

Die verbleibende TBT im Mobil-Profil stammt aus Start-Code und der einmaligen Score-Berechnung unter vierfach gedrosselter CPU.

## Aufgabe 10: Profiler

- Tippen im Suchfeld: Der Durchlauf für `SessionList` sinkt von „deutlich über 16 ms“ auf wenige Millisekunden oder darunter, weil nur noch `filter()` auf vorberechneten Werten läuft.
- Die Uhr löst weiterhin einmal pro Sekunde einen Durchlauf aus; er ist jetzt billig.
- `NG0956` erscheint nicht mehr, auch nicht nach dem automatischen Neuladen.

## Erweiterung

**Lazy Detailseite** (`src/app/app.routes.ts`):

```ts
{
  path: 'sessions/:id',
  loadComponent: () => import('./sessions/session-detail').then((m) => m.SessionDetail),
  title: 'EventHub – Session',
},
```

**Nur benötigte Chart.js-Bausteine** (`src/app/stats/booking-chart.ts`):

```ts
import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);
```

Der Chunk `booking-chart` schrumpft von 206,83 kB auf 161,02 kB (gemessen mit demselben Stand).

**Budget-Abbruch:** Mit `"maximumError": "200kB"` für `initial` endet `npm run build` mit Exit-Code 1:

```text
✘ [ERROR] bundle initial exceeded maximum budget. Budget 200.00 kB was not met by 88.12 kB with a total of 288.12 kB.
```

Genau diesen Abbruch nutzt die CI-Pipeline in Lab 14.1.
