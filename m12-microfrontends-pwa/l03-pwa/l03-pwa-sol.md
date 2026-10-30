# Lab 12.3 – Lösung: Progressive Web App

Ergebnis: `project/workspaces/eventhub-pwa-final/` (Ausgangszustand `eventhub-pwa/` plus `ng add @angular/pwa` und die Änderungen unten). Infoseite in der Kurs-App: `/examples/m12-microfrontends-pwa/l03-pwa`.

## Aufgabe 1: Ohne PWA

`npx ng serve` zeigt auf http://localhost:4240 zwölf Programmpunkte. Application › Service Workers zeigt für `localhost:4240` keinen Service Worker.

## Aufgabe 2: `ng add @angular/pwa`

```text
CREATE ngsw-config.json                       → Service Worker: was gespeichert wird
CREATE public/manifest.webmanifest            → Manifest
CREATE public/icons/icon-72x72.png … 512x512  → Icons (8 Dateien)
UPDATE angular.json                           → "serviceWorker": "ngsw-config.json" (Produktion)
UPDATE package.json                           → @angular/service-worker
UPDATE src/app/app.config.ts                  → Registrierung: provideServiceWorker(...)
UPDATE src/index.html                         → <link rel="manifest" …>
```

## Aufgabe 3: Manifest

`public/manifest.webmanifest`:

```json
{
  "name": "EventHub Programm",
  "short_name": "EventHub",
  "lang": "de",
  "theme_color": "#c3002f",
  "background_color": "#f6f7f9",
  "display": "standalone",
  "scope": "./",
  "start_url": "./",
  "icons": [
    { "src": "icons/icon-72x72.png", "sizes": "72x72", "type": "image/png", "purpose": "maskable any" },
    { "src": "icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable any" },
    { "src": "icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable any" }
  ]
}
```

(Icon-Liste gekürzt; `ng add` trägt alle acht Größen ein.) In `src/index.html` zusätzlich `<meta name="theme-color" content="#c3002f" />`.

## Aufgabe 4: Produktions-Build

```bash
npx ng build
npm run serve:dist        # http-server dist/eventhub-pwa/browser -p 8080 -c-1
```

`dist/eventhub-pwa/browser/` enthält jetzt zusätzlich `ngsw-worker.js`, `ngsw.json`, `safety-worker.js` und `worker-basic.min.js`. Application › Service Workers: Quelle `ngsw-worker.js`, Status „activated and is running“. Cache Storage enthält Einträge mit `ngsw` und `assets:app` im Namen.

## Aufgabe 5: Ohne Daten-Gruppe offline

Die Seite lädt (HTML, JS, CSS kommen aus der Asset-Gruppe `app`), zeigt aber „Programm nicht erreichbar. Läuft `npm run api` im Kursprojekt?“: Die API-Antwort ist nirgends gespeichert.

## Aufgabe 6: Daten-Gruppe

`ngsw-config.json` (Ergänzung nach `assetGroups`):

```json
  "dataGroups": [
    {
      "name": "programm-api",
      "urls": ["http://localhost:3000/sessions", "http://localhost:3000/speakers"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxSize": 20,
        "maxAge": "1d",
        "timeout": "3s"
      }
    }
  ]
```

`freshness`, weil das Programm bei Netz aktuell sein soll und nur ohne Netz aus dem Cache kommen darf.

## Aufgabe 7: Offline-Test

```bash
npx ng build              # Terminal 2; serve:dist läuft in einem weiteren Terminal weiter
```

Erstes Neuladen: Der Service Worker erkennt die neue Version (neue `ngsw.json`). Zweites Neuladen: Die neue Version mit Daten-Gruppe ist aktiv und speichert die Antwort von `/sessions`. Ohne Mock-API und im Modus „Offline“ zeigt die Seite alle zwölf Programmpunkte. Cache Storage enthält zusätzlich einen Eintrag mit `data:programm-api` im Namen.

Im Build steht die Gruppe übersetzt in `dist/eventhub-pwa/browser/ngsw.json`:

```json
"dataGroups": [{ "name": "programm-api", "patterns": ["http:\\/\\/localhost:3000\\/sessions", "http:\\/\\/localhost:3000\\/speakers"],
  "strategy": "freshness", "maxSize": 20, "maxAge": 86400000, "timeoutMs": 3000, "version": 1 }]
```

## Aufgabe 8: Update-Hinweis

`src/app/update-banner.ts`:

```ts
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

/** Zeigt einen Hinweis, sobald der Service Worker eine neue App-Version geladen hat. */
@Component({
  selector: 'app-update-banner',
  template: `
    @if (updateReady()) {
      <div class="card row">
        <span>Eine neue Version von EventHub ist bereit.</span>
        <button class="btn btn-primary" (click)="reload()">Jetzt neu laden</button>
      </div>
    }
  `,
})
export class UpdateBanner {
  private readonly swUpdate = inject(SwUpdate);
  protected readonly updateReady = signal(false);

  constructor() {
    // isEnabled ist false im Entwicklungsmodus (ng serve) und ohne Service-Worker-Unterstützung.
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(
          filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
          takeUntilDestroyed(),
        )
        .subscribe(() => this.updateReady.set(true));
    }
  }

  protected reload(): void {
    document.location.reload();
  }
}
```

`src/app/app.ts` (Änderungen):

```ts
import { UpdateBanner } from './update-banner';

@Component({
  selector: 'app-root',
  imports: [DatePipe, UpdateBanner],
  template: `
    <main class="container">
      <app-update-banner />
      <h1>EventHub Programm</h1>
      ...
```

`signal` statt eines normalen Felds, weil die App zoneless läuft: Nur so bemerkt Angular die Änderung aus dem Observable (Lab 6.1). `takeUntilDestroyed()` beendet das Abo mit der Komponente (Lab 5.3).

## Aufgabe 9: Update erleben

Nach dem zweiten Build und einmal Neuladen zeigt die Seite noch die alte Überschrift; der Service Worker lädt die neue Version im Hintergrund und meldet `VERSION_READY`. Der Hinweis „Eine neue Version von EventHub ist bereit.“ erscheint, „Jetzt neu laden“ zeigt die neue Überschrift. Angular prüft auf Updates mit kurzer Verzögerung nach dem Seitenaufruf; deshalb einige Sekunden warten.

## Erweiterung

```ts
// im Konstruktor von UpdateBanner, innerhalb von if (this.swUpdate.isEnabled)
interval(30 * 60 * 1000)
  .pipe(takeUntilDestroyed())
  .subscribe(() => this.swUpdate.checkForUpdate());
```

Mit `performance` (z. B. `"maxAge": "1h"`) liefert der Service Worker die gespeicherte Antwort sofort und fragt das Netz erst nach Ablauf von `maxAge` wieder: Eine Änderung in `api/db.json` (nach Neustart der Mock-API) erscheint erst nach bis zu einer Stunde. Mit `freshness` erscheint sie beim nächsten Neuladen.
