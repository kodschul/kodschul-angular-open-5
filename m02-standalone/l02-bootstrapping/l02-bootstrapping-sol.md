# Lab 2.2 – Lösung: Bootstrapping mit app.config.ts und app.routes.ts

## Aufgabe 1: app.config.ts und app.routes.ts lesen

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),               // unbehandelte Fehler/Promise-Ablehnungen an den ErrorHandler
    provideRouter(routes, withComponentInputBinding()), // Router mit den Routen aus app.routes.ts; Parameter als @Input
    provideHttpClient(withFetch()),                     // HttpClient über fetch; Ort für spätere Interceptors
  ],
};
```

`/playground` bedient die Route `{ path: 'playground', title: 'Playground', loadComponent: () => import('./playground/playground').then((m) => m.Playground) }`. `loadComponent` lädt die Datei erst beim ersten Aufruf.

Zone-Konfiguration fehlt bewusst: Angular 22 läuft ohne Eintrag zoneless.

## Aufgabe 2: Ausgangszustand

```text
App nicht gestartet: NG0201: No provider found for `_EventHubConfigService`. Source: Environment Injector.
```

`MiniApp` injiziert `EventHubConfigService`, die leere `ApplicationConfig` stellt ihn nicht bereit. `bootstrapApplication` lehnt sein Promise ab, `playground.ts` zeigt die Meldung.

## Aufgaben 3 und 4: mini-app.config.ts

```ts
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideEventHubConfig } from './eventhub-config';

export function createMiniAppConfig(configUrl = '/config.json'): ApplicationConfig {
  return {
    providers: [
      provideHttpClient(withFetch()),
      provideEventHubConfig(configUrl),
    ],
  };
}
```

In Angular 22 ist `HttpClient` auch ohne `provideHttpClient()` injizierbar (`providedIn: 'root'`, Fetch-Backend; geprüft in `@angular/common` 22.2). Der Eintrag macht die Wahl sichtbar und ist der Ort für `withInterceptors`.

Nach Aufgabe 4 lautet die Meldung weiter `NG0201 … _EventHubConfigService`, weil `provideEventHubConfig()` noch eine leere Liste liefert.

## Aufgaben 5 und 6: provideEventHubConfig()

```ts
import { HttpClient } from '@angular/common/http';
import {
  EnvironmentProviders,
  Injectable,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface EventHubConfig {
  apiUrl: string;
  featureFlags: { comments: boolean };
}

@Injectable()
export class EventHubConfigService {
  private readonly http = inject(HttpClient);
  private loaded?: EventHubConfig;
  loadedAt?: Date;

  load(url: string): Observable<EventHubConfig> {
    return this.http.get<EventHubConfig>(url).pipe(
      tap((config) => {
        this.loaded = config;
        this.loadedAt = new Date();
      }),
    );
  }

  get config(): EventHubConfig {
    if (!this.loaded) throw new Error('EventHub-Konfiguration ist noch nicht geladen');
    return this.loaded;
  }
}

export function provideEventHubConfig(url = '/config.json'): EnvironmentProviders {
  return makeEnvironmentProviders([
    EventHubConfigService,
    provideAppInitializer(() => inject(EventHubConfigService).load(url)),
  ]);
}
```

- Nur Aufgabe 5 ohne 6: Meldung `EventHub-Konfiguration ist noch nicht geladen`, weil niemand `load()` aufruft.
- `() => { inject(EventHubConfigService).load(url); }` (geschweifte Klammern ohne `return`) führt zum selben Fehler: Das Observable wird nie abonniert, Angular wartet auf nichts.

## Aufgabe 7: Ergebnis und Reihenfolge

```text
EventHub Mini-App
- API-URL aus config.json: http://localhost:3000
- Feature „Kommentare“: an
- Konfiguration geladen: 20:23:41.026
- Root-Komponente erzeugt: 20:23:41.026
12 Sessions von http://localhost:3000 geladen.
```

Network-Tab: zuerst `config.json` (vom Dev-Server, Port 4200), danach `sessions` (Mock-API, Port 3000). Beide Zeitstempel liegen in derselben Millisekunde oder die Komponente kommt später, nie früher.

## Aufgabe 8: Konfiguration ohne Neubau ändern

Mit `"comments": false` zeigt die Mini-App nach dem Neuladen „Feature „Kommentare“: aus“. Der Build ändert sich nicht: `config.json` wird zur Laufzeit geladen. Mit einem Wert in `environment.ts` wäre ein neuer Build nötig.

Referenz-App: `src/app/examples/m02-standalone/l02-bootstrapping/` (`example.ts`, `mini-app.ts`, `mini-app.config.ts`, `eventhub-config.ts`), URL `/examples/m02-standalone/l02-bootstrapping`.

## Erweiterung

**1. Fehlerfall:** `/playground?configUrl=/config-fehlt.json` zeigt

```text
App nicht gestartet: Http failure response for http://localhost:4200/config-fehlt.json: 404 Not Found
```

Das Observable des Initializers endet mit einem Fehler. Angular bricht den Start ab, bevor `MiniApp` erzeugt wird; das Promise von `bootstrapApplication` wird abgelehnt.

**2. Rückfall auf Standardwerte:**

```ts
import { Observable, catchError, of, tap } from 'rxjs';

const DEFAULT_CONFIG: EventHubConfig = { apiUrl: 'http://localhost:3000', featureFlags: { comments: false } };

load(url: string): Observable<EventHubConfig> {
  return this.http.get<EventHubConfig>(url).pipe(
    catchError(() => of(DEFAULT_CONFIG)),   // Fehler abfangen, Ersatzwert weitergeben
    tap((config) => {
      this.loaded = config;
      this.loadedAt = new Date();
    }),
  );
}
```

Mit `?configUrl=/config-fehlt.json` startet die Mini-App jetzt und zeigt „Kommentare: aus“. Ob ein stiller Rückfall oder ein Startabbruch richtig ist, hängt vom Wert ab: Eine falsche API-URL in Produktion fällt mit Abbruch schneller auf.
