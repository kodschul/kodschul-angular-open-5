# Lab 1.1 – Lösung: Kurs-Workspace und Angular 22

## Aufgabe 1: Installation

```bash
cd project
npm install
```

Erwartet: `added … packages`, keine Fehler. Warnungen `EBADENGINE` erscheinen bei Node-Versionen außerhalb der unterstützten Liste; mit Node 22 oder 24 LTS verschwinden sie.

## Aufgabe 2: Mock-API

```bash
npm run api
```

```text
EventHub Mock-API läuft auf http://localhost:3000
```

http://localhost:3000/sessions liefert ein JSON-Array mit zwölf Sessions, jede mit `speaker`-Objekt.

## Aufgabe 3: App starten

```bash
npm start
```

Die Ausgabe endet mit `Local: http://localhost:4200/`. Die Startseite listet alle Module und Labs nach Tagen.

## Aufgabe 4: Projekt lesen

| Frage | Antwort im Kurs-Projekt |
| --- | --- |
| Angular-Version | `@angular/core` `^22.2.0` in `package.json` (installiert 22.2.x) |
| Build-Builder | `@angular/build:application` in `angular.json` (`serve`: `@angular/build:dev-server`, `test`: `@angular/build:unit-test`) |
| Start | `bootstrapApplication(App, appConfig)` in `src/main.ts` |
| Provider in `app.config.ts` | `provideBrowserGlobalErrorListeners()`, `provideRouter(routes, withComponentInputBinding())`, `provideHttpClient(withFetch())` |
| zone.js | kommt weder in `package.json` noch in `angular.json` (`polyfills`) vor: die App läuft zoneless |

## Aufgabe 5 und 6: Session-Liste im Playground

```ts
import { AsyncPipe } from '@angular/common';
import { Component, VERSION, inject } from '@angular/core';
import { SessionApi } from '../shared/api';

@Component({
  selector: 'app-playground',
  imports: [AsyncPipe],
  template: `
    <h1>Playground</h1>
    <p class="muted">Angular {{ version }}</p>

    @if (sessions$ | async; as sessions) {
      <div class="grid">
        @for (session of sessions; track session.id) {
          <div class="card">
            <strong>{{ session.title }}</strong>
            <p class="muted">{{ session.room }}</p>
          </div>
        }
      </div>
    } @else {
      <p class="loading">Lade Sessions …</p>
    }
  `,
})
export class Playground {
  private readonly api = inject(SessionApi);

  protected readonly version = VERSION.full;
  protected readonly sessions$ = this.api.getSessions();
}
```

- `async` abonniert `sessions$`, liefert das Array an `sessions` und meldet Angular den neuen Wert; zoneless ist das der Anlass für die Aktualisierung.
- Solange noch kein Wert da ist, ist der Ausdruck `null`, deshalb greift `@else`.
- `track session.id` identifiziert jede Karte eindeutig.

## Aufgabe 7: Angular DevTools

Der Tab „Angular“ zeigt den Baum `App` → `Playground`. Bei `Playground` stehen die Eigenschaften `version` (z. B. `"22.2.3"`) und `sessions$` (Observable). Der Baum enthält keine NgModules.

## Aufgabe 8: Ohne Mock-API

Die Seite bleibt bei „Lade Sessions …“. Die Konsole zeigt `GET http://localhost:3000/sessions net::ERR_CONNECTION_REFUSED` und einen `HttpErrorResponse`. Das Observable endet mit einem Fehler, die `async`-Pipe liefert nie ein Array. Fehleranzeige im Template folgt in Modul 5.

## Erweiterung

```html
@if (sessions$ | async; as sessions) {
  <p>{{ sessions.length }} Sessions geladen</p>
  …
}
```

Referenz-App: `src/app/examples/m01-angular-recap/l01-workspace/example.ts`, URL `/examples/m01-angular-recap/l01-workspace`.
