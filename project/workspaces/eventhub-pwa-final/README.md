# eventhub-pwa-final (Lab 12.3, Ergebnis)

`eventhub-pwa` nach `ng add @angular/pwa` mit angepasstem Manifest, Daten-Gruppe `programm-api` (`freshness`) in `ngsw-config.json` und Update-Hinweis per `SwUpdate` (`src/app/update-banner.ts`).

## Start

Der Service Worker läuft nur im Produktions-Build, nicht mit `ng serve`.

```bash
# Mock-API im Kursprojekt (project/)
npm run api

# in diesem Ordner
npm install
npx ng build
npm run serve:dist          # http://localhost:8080
```

Offline-Test: Seite laden, Mock-API stoppen oder DevTools › Network › „Offline“, neu laden.
