# Lab 8.2 – Lösung: Preloading-Strategien

Fertiges Ergebnis: `src/app/examples/m08-advanced-routing/l02-preloading/` (Ordner `eventhub/` und `app.config.ts` für den Workspace). Die Route `/examples/m08-advanced-routing/l02-preloading` der Kurs-App zeigt die Seiten, lädt aber nicht vor, weil `withPreloading` nur in der Root-Konfiguration wirkt.

## Aufgabe 1: PreloadAllModules

```ts
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

provideRouter(EVENTHUB_ROUTES, withComponentInputBinding(), withPreloading(PreloadAllModules)),
```

Nach dem Neuladen erscheinen ohne Klick der Admin-Chunk und der Speaker-Chunk. Jede Person lädt damit wieder den kompletten Code, nur später.

## Aufgabe 2: Eigene Strategie

```ts
// eventhub/delayed-preloading.ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, switchMap, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DelayedPreloading implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.data?.['preload'] !== true) {
      return of(null);
    }
    console.log(`[Preloading] "${route.path}" startet in 2 s`);
    return timer(2000).pipe(
      switchMap(() => {
        console.log(`[Preloading] lade "${route.path}"`);
        return load();
      }),
    );
  }
}
```

`!== true` statt `!route.data?.['preload']`: Nur ein ausdrückliches `true` lädt vor; fehlende Angaben bleiben beim sicheren Standard „nicht vorladen“.

## Aufgabe 3: Strategie aktivieren

```ts
// app.config.ts
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { DelayedPreloading } from './eventhub/delayed-preloading';
import { EVENTHUB_ROUTES } from './eventhub/eventhub.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(EVENTHUB_ROUTES, withComponentInputBinding(), withPreloading(DelayedPreloading)),
    provideHttpClient(withFetch()),
  ],
};
```

## Aufgabe 4: Routen markieren

```ts
{
  path: 'speakers',
  data: { preload: true },
  loadChildren: () => import('./speakers/speakers.routes'),
},
{
  path: 'admin',
  title: 'Admin',
  data: { preload: false },
  loadComponent: () => import('./admin/admin-page').then((m) => m.AdminPage),
},
```

`data: { preload: false }` am Admin ändert das Verhalten nicht, dokumentiert aber die Entscheidung im Code.

## Aufgabe 5: Beobachtung ohne Klick

| Zeit | Konsole | Network (JS) |
| --- | --- | --- |
| 0 s | `[SessionsStore] erzeugt`, `[Preloading] "speakers" startet in 2 s` | Initial Chunks |
| ca. 2 s | `[Preloading] lade "speakers"` | Speaker-Chunk (`speakers.routes`) |
| danach | – | kein Admin-Chunk |

Die Strategie wird nur für Lazy-Routen gefragt (`speakers`, `admin`), nicht für `sessions`.

## Aufgabe 6: Klicks

| Klick | Neuer JS-Request |
| --- | --- |
| Speaker | nein, vorgeladen |
| Admin | ja, Admin-Chunk |

## Aufgabe 7: Slow 4G

Mit Drosselung dauert der Start deutlich länger; der Speaker-Chunk folgt weiterhin 2 Sekunden nach dem Start der Strategie und konkurriert damit nicht mit den Initial Chunks. Der Admin-Klick zeigt die Wartezeit, die Preloading beim Speaker-Bereich vermeidet.

## Erweiterung

```ts
preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
  const saveData = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData === true;
  if (route.data?.['preload'] !== true || saveData) {
    return of(null);
  }
  const delayMs = (route.data?.['delayMs'] as number | undefined) ?? 2000;
  return timer(delayMs).pipe(switchMap(() => load()));
}
```

`navigator.connection` gibt es nicht in jedem Browser (Network Information API, `prüfen`); der optionale Zugriff verhindert Fehler.
