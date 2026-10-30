# Lab 11.3 – Lösung: Angular Elements

Workspace: `project/workspaces/eventhub-elements/` (Ausgangszustand mit `registered`; die Änderungen aus Aufgabe 4–5 stehen unten). Infoseite in der Kurs-App: `/examples/m11-libraries/l03-elements`.

## Aufgabe 1: Build

```bash
npm run build
```

```text
Initial chunk files | Names         |  Raw size | Estimated transfer size
main.js             | main          | 172.26 kB |                47.78 kB
```

```text
dist/eventhub-elements/browser/
├── demo.html
├── favicon.ico
├── index.html
└── main.js
```

Eine einzige JavaScript-Datei: kein Hash im Namen (`outputHashing: "none"`), keine Polyfills (zoneless), kein globales Stylesheet (`styles: []` in `angular.json`).

## Aufgabe 2: Demo-Seite

```bash
npm run serve:dist          # http-server dist/eventhub-elements/browser -p 4230 -c-1
```

Nach „Anmelden“ zeigt „Ereignisse“:

```text
Anmeldung: {
  "sessionTitle": "Signals in der Praxis",
  "name": "Ada",
  "email": "ada@example.org",
  "tickets": 2
}
```

Das Formular ist danach leer (`form.reset()`).

## Aufgabe 3: Attribute und Properties

```js
$0.setAttribute('session-title', 'RxJS-Workshop');   // Überschrift: "Anmeldung: RxJS-Workshop"
$0.maxTickets = 1;                                    // Property in camelCase, Zahl ohne Umwandlung
```

`$0` ist in den Chrome-DevTools das zuletzt im Tab „Elements“ gewählte Element. Mit `maxTickets = 1` setzt Angular `max="1"` am Zahlenfeld; der eingebaute Max-Validator macht einen Wert von 2 ungültig, der Button bleibt gesperrt.

## Aufgabe 4: Output `cancelled`

`src/app/signup-widget.ts` (Änderungen):

```ts
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      ...
      <button type="submit" [disabled]="form.invalid">Anmelden</button>
      <button type="button" class="secondary" (click)="cancel()">Abbrechen</button>
    </form>
  `,
  styles: `
    ...
    button.secondary { background: #fff; color: #1d2330; border: 1px solid #dde1e8; margin-left: 0.5rem; }
  `,
})
export class SignupWidget {
  // ... sessionTitle, maxTickets, registered wie bisher
  /** Neu: DOM-Event "cancelled" ohne Daten (event.detail ist null). */
  readonly cancelled = output<void>();

  protected cancel(): void {
    this.form.reset();
    this.cancelled.emit();
  }
}
```

`type="button"` verhindert, dass der Button das Formular absendet.

## Aufgabe 5: Listener in der Seite

`public/demo.html` (Ergänzung im zweiten `<script>`):

```html
<script>
  const widget = document.querySelector('eventhub-signup');
  const log = document.getElementById('log');

  widget.addEventListener('registered', (event) => {
    log.textContent = 'Anmeldung: ' + JSON.stringify(event.detail, null, 2);
  });

  // Neu: Output "cancelled" ohne Daten
  widget.addEventListener('cancelled', () => {
    log.textContent = 'Anmeldung abgebrochen.';
  });
</script>
```

Der Listener darf vor dem Laden von `main.js` registriert werden: `<eventhub-signup>` existiert als unbekanntes Element bereits im DOM und wird später „aufgewertet“.

## Aufgabe 6: Neu bauen und testen

`npm run build`, danach `/demo.html` neu laden. „Abbrechen“ leert das Formular und zeigt „Anmeldung abgebrochen.“; „Anmelden“ zeigt weiter das JSON. `npm run serve:dist` muss nicht neu gestartet werden; `-c-1` schaltet das Browser-Caching ab.

## Aufgabe 7: Größe

Der Tab „Network“ zeigt für `main.js` rund 172 kB: `http-server` liefert die Datei unkomprimiert. Ein Produktionsserver mit gzip oder Brotli überträgt rund 48 kB, das entspricht der Spalte „Estimated transfer size“ aus Aufgabe 1. Der Wert ist der Preis für Angular plus Widget auf einer Seite ohne Angular.

## Erweiterung: zweites Element im selben Build

`src/app/session-count.ts`:

```ts
import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';

/** Zweites Element aus demselben Build: Anzahl der Sessions aus der Mock-API. */
@Component({
  selector: 'eventhub-session-count-widget',
  template: `@if (sessions.hasValue()) { {{ sessions.value().length }} Sessions im Programm } @else { … }`,
})
export class SessionCount {
  protected readonly sessions = httpResource<unknown[]>(() => 'http://localhost:3000/sessions');
}
```

`src/main.ts`:

```ts
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { SessionCount } from './app/session-count';
import { SignupWidget } from './app/signup-widget';

createApplication({ providers: [provideBrowserGlobalErrorListeners(), provideHttpClient(withFetch())] })
  .then((appRef) => {
    customElements.define('eventhub-signup', createCustomElement(SignupWidget, { injector: appRef.injector }));
    customElements.define('eventhub-session-count', createCustomElement(SessionCount, { injector: appRef.injector }));
  })
  .catch((err) => console.error(err));
```

In `demo.html`: `<eventhub-session-count></eventhub-session-count>` zeigt „12 Sessions im Programm“. `main.js` wächst auf 210 kB roh bzw. 58 kB komprimiert, vor allem durch `HttpClient`; Angular selbst ist nur einmal enthalten.

Das doppelt eingebundene Widget erzeugt zwei unabhängige Instanzen; jedes Event kommt nur am auslösenden Element an.
