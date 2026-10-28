# eventhub-pwa (Lab 12.3, Ausgangszustand)

Kleine Angular-22-App mit dem Konferenzprogramm aus der Mock-API (`http://localhost:3000/sessions`). In Lab 12.3 wird sie mit `ng add @angular/pwa` zur PWA. Das Ergebnis liegt in `../eventhub-pwa-final/`.

## Start

```bash
# Mock-API im Kursprojekt (output/project/)
npm run api

# in diesem Ordner
npm install
npx ng serve                # http://localhost:4240 (ohne Service Worker)
npx ng build && npm run serve:dist   # http://localhost:8080 (Produktions-Build)
```
