# Lab 10.5: End-to-End-Tests mit Cypress

**Leitfragen:**

<details>
<summary>Welche drei Abläufe der EventHub-App dürften nie kaputtgehen?</summary>

Zum Beispiel: Anmelden, Session finden und merken, Ticket buchen. E2E-Tests lohnen sich für genau diese wenigen Geschäftsabläufe, nicht für jede Kleinigkeit.

</details>

<details>
<summary>Warum schlägt ein Test manchmal fehl und beim nächsten Lauf nicht?</summary>

Meist Timing: Der Test prüft, bevor die Antwort da ist, oder hängt an fester Wartezeit. Weitere Ursachen sind geteilte Testdaten zwischen Läufen und Selektoren, die sich mit dem Layout ändern. Solche Tests heißen „flaky“ (flackernd).

</details>

<details>
<summary>Soll ein E2E-Test die echte API benutzen?</summary>

Für den Hauptablauf ja, sonst prüft der Test nicht das Zusammenspiel. Für Fehlerfälle und seltene Antworten (Server down, leere Liste) ist eine abgefangene Antwort stabiler und schneller.

</details>

- Cypress steuert einen echten Browser gegen die laufende App (`npm start`) und die Mock-API (`npm run api`).
- Stabile E2E-Tests stehen auf drei Beinen: Selektoren über `data-cy`, Netzwerk über `cy.intercept`, Login über die API statt über das Formular.
- Testseite: `/examples/m10-testing/l05-cypress` vereint Login, Suche, Favoriten-Schalter und Header-Zähler (Muster aus Lab 5.2, 6.3 und 9.2) auf einer Seite mit `data-cy`-Attributen.

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| E2E-Test | prüft einen Ablauf so, wie Nutzende ihn erleben: Browser, App und Server zusammen |
| Cypress | E2E-Werkzeug; Tests laufen im Browser direkt neben der App und warten automatisch auf Elemente |
| `data-cy` | eigenes HTML-Attribut nur für Tests; ändert sich nicht, wenn CSS-Klassen oder Texte sich ändern |
| `cy.intercept` | beobachtet oder ersetzt HTTP-Anfragen der App (Stub, Fehler, Verzögerung) |
| `cy.session` | merkt sich Login-Zustand (localStorage, sessionStorage, Cookies) und stellt ihn in späteren Tests ohne erneuten Login wieder her |
| Retry-ability | Cypress wiederholt Abfrage und Assertion, bis sie passt oder der Timeout (Standard 4 s) abläuft |
| Flaky Test | Test, der ohne Codeänderung mal grün, mal rot ist |

## Einrichtung im Kurs-Repo

Die Einrichtung ist bereits erledigt (`cypress` 16 in `devDependencies`, Konfiguration und Ordner vorhanden). In einem eigenen Projekt richtet `ng add @cypress/schematic` dasselbe ein (Version 6.0.0, Peer-Abhängigkeiten `@angular/core >=21`, `cypress ^16`; Quelle: https://www.npmjs.com/package/@cypress/schematic, Stand 28.10.2026).

```text
project/
├── cypress.config.ts          # Konfiguration
└── cypress/
    ├── tsconfig.json          # eigene TS-Konfiguration (Cypress-Typen statt Vitest)
    ├── e2e/                   # Tests: *.cy.ts
    │   ├── favorites.cy.ts
    │   └── api-down.cy.ts
    ├── fixtures/              # feste Testdaten (JSON)
    ├── support/
    │   ├── e2e.ts             # wird vor jeder Spec geladen
    │   └── commands.ts        # eigene Befehle: cy.login, cy.getByCy
    └── starters/              # Starter der Übung (läuft nicht automatisch)
```

```ts
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',   // cy.visit('/…') relativ dazu
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    video: true,                        // Video bei "cypress run" (Standard: aus)
  },
  expose: {
    apiUrl: 'http://localhost:3000',    // im Test: Cypress.expose('apiUrl')
  },
});
```

Cypress 16 trennt öffentliche Werte (`expose`, gelesen mit `Cypress.expose()`) von Geheimnissen (`env`, gelesen mit `cy.env([...])`); `Cypress.env()` aus älteren Versionen ist seit 16.0.0 entfernt (Breaking Change). Quelle: Cypress-Changelog, Abschnitt 16.0.0, https://docs.cypress.io/app/references/changelog (Stand 28.10.2026, aktuelle Version 16.2.1).

| Befehl | Wirkung |
| --- | --- |
| `npx cypress install` | lädt die Cypress-App (Binary, mehrere 100 MB); im Kurs vorab erledigt (Setup), sonst nötig, wenn `npm install` ohne Binary lief |
| `npx cypress verify` | prüft, ob das Binary startet |
| `npm run cy:open` | interaktive Oberfläche: Spec wählen, Zeitreise durch jeden Schritt |
| `npm run e2e` | alle Specs ohne Oberfläche (headless), Video und Screenshots |
| `npx cypress run --spec cypress/e2e/favorites.cy.ts` | nur eine Spec |

## Stabile Selektoren mit data-cy

```html
<input type="search" data-cy="search-input" … />
<li data-cy="search-result">
  <button data-cy="favorite-toggle">☆</button> Testen ohne Tränen
</li>
<span class="badge" data-cy="favorites-count">★ 1</span>
```

| Selektor | Bricht, wenn … | Bewertung |
| --- | --- | --- |
| `cy.get('.card > ul li:nth-child(1) button')` | Layout oder Reihenfolge sich ändert | vermeiden |
| `cy.get('.btn-primary')` | Styling sich ändert | vermeiden |
| `cy.contains('Anmelden')` | Text oder Sprache sich ändert | ok für sichtbaren Text, der Teil der Anforderung ist |
| `cy.get('[data-cy=login-submit]')` | jemand das Attribut löscht | bevorzugt |

## Ein E2E-Test

```ts
describe('Favoriten-Flow', () => {
  const page = '/examples/m10-testing/l05-cypress';

  it('zählt einen gesuchten Favoriten im Header', () => {
    cy.login('user@eventhub.test', 'user123');                          // Login per API (unten)
    cy.intercept({ method: 'GET', pathname: '/sessions' }).as('search'); // nur beobachten
    cy.visit(page);

    cy.getByCy('search-input').type('testing');
    cy.wait('@search').its('request.url').should('include', 'q=testing'); // auf die Anfrage warten

    cy.getByCy('search-result').first().find('[data-cy=favorite-toggle]').click();
    cy.getByCy('favorites-count').should('contain.text', '1');           // wiederholt bis zu 4 s
  });
});
```

Cypress-Befehle laufen nacheinander in einer Warteschlange; `should` wird so lange wiederholt, bis es passt. Ein festes `cy.wait(1000)` ist deshalb fast nie nötig.

## Netzwerk abfangen mit cy.intercept

| Ziel | Aufruf |
| --- | --- |
| Anfrage beobachten, auf sie warten | `cy.intercept({ method: 'GET', pathname: '/sessions' }).as('search')` + `cy.wait('@search')` |
| Antwort ersetzen (Stub) | `cy.intercept(…, { body: [ … ] })` oder `{ fixture: 'sessions-stub.json' }` |
| Serverfehler simulieren | `cy.intercept(…, { statusCode: 500, body: { message: 'Interner Fehler' } })` |
| Netzwerkausfall simulieren | `cy.intercept(…, { forceNetworkError: true })` |
| Langsame Antwort | `cy.intercept(…, { delay: 2000, fixture: '…' })` |

```ts
it('zeigt eine Fehlermeldung bei Status 500', () => {
  cy.intercept({ method: 'GET', pathname: '/sessions' }, { statusCode: 500 }).as('search');
  cy.visit(page);
  cy.getByCy('search-input').type('angular');
  cy.wait('@search');
  cy.getByCy('search-error').should('be.visible');
});
```

Die Route muss **vor** der Aktion registriert sein, die die Anfrage auslöst.

## Login per API mit cy.session

Der Login über das Formular wird einmal getestet. Alle anderen Tests melden sich per `cy.request` an; `cy.session` speichert das Ergebnis und spielt es in späteren Tests wieder ein.

```ts
// cypress/support/commands.ts
const TOKEN_KEY = 'eventhub.token'; // gleicher Schlüssel wie in der App

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      getByCy(name: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email], () => {                 // Schlüssel: pro E-Mail eine gespeicherte Sitzung
    cy.request('POST', `${Cypress.expose('apiUrl')}/auth/login`, { email, password }).then(({ body }) => {
      window.sessionStorage.setItem(TOKEN_KEY, body.accessToken); // wie Lab 9.2: Token im sessionStorage
    });
  });
});

Cypress.Commands.add('getByCy', (name: string) => cy.get(`[data-cy=${name}]`));
```

Die Testseite speichert das Token wie Lab 9.2 im `sessionStorage`, liest beim Start `sessionStorage['eventhub.token']` und ruft `GET /auth/me` auf; dadurch ist der Test sofort angemeldet. `cy.session` sichert neben Cookies und `localStorage` auch den `sessionStorage` und spielt ihn vor jedem Test wieder ein.

## Warum Tests flackern

| Ursache | Beispiel | Abhilfe |
| --- | --- | --- |
| feste Wartezeit | `cy.wait(500)` vor der Prüfung | auf Alias (`cy.wait('@search')`) oder Assertion warten |
| Antwort langsamer als Timeout | API braucht 5 s, Standard-Timeout 4 s | Timeout gezielt erhöhen (`{ timeout: 10000 }`) oder Antwort stubben |
| geteilte Daten | Test 1 setzt einen Favoriten auf dem Server, Test 2 erwartet 0 | Zustand vor jedem Test herstellen, Daten pro Test isolieren |
| unsichere Selektoren | `nth-child`, CSS-Klassen | `data-cy` |
| Reihenfolge-Abhängigkeit | Test 2 nutzt Login aus Test 1 | jeder Test meldet sich selbst an (`cy.login`) |
| Animationen, Debounce | Klick, bevor die Liste steht | auf sichtbares Ergebnis prüfen, dann klicken |

## Cypress Component Testing (kurz)

Cypress kann einzelne Komponenten im echten Browser mounten (`cy.mount(SessionCard, { componentProperties: … })`). Für Angular unterstützt Cypress Component Testing Angular 21 und 22 und braucht das Paket `@angular-devkit/build-angular` (Webpack-Bundling), auch in Projekten mit `@angular/build`; im Kurs-Repo ist es nicht installiert. Quelle: https://docs.cypress.io/app/component-testing/angular/overview (Stand 28.10.2026). Im Kurs übernehmen Vitest und `TestBed` (Lab 10.2) diese Ebene.

## Cypress oder Playwright?

| Kriterium | Cypress | Playwright |
| --- | --- | --- |
| Architektur | Test läuft im Browser neben der App | Node-Prozess steuert den Browser über ein Protokoll |
| Sprachen | JavaScript/TypeScript | TypeScript/JavaScript, Python, Java, .NET |
| Browser | Chrome-Familie, Edge, Firefox; WebKit experimentell | Chromium, Firefox, WebKit |
| Mehrere Tabs, Fenster, Domains | eingeschränkt (`cy.origin` für Domains) | eingebaut |
| Warten | automatisches Wiederholen von Abfragen und Assertions | Auto-Waiting bei Aktionen, `expect` mit Wiederholung |
| Netzwerk | `cy.intercept` | `page.route` |
| Login wiederverwenden | `cy.session` | `storageState` |
| Parallelisierung | über Cypress Cloud (kostenpflichtig) oder Drittanbieter | eingebaut (Worker, Sharding) |
| Debugging | interaktive Oberfläche mit Zeitreise | UI-Modus, Trace Viewer |
| Angular-Einrichtung | `ng add @cypress/schematic` | `ng add playwright-ng-schematics` (Community) |

Stand: 28.10.2026. Quellen: Browser Cypress https://docs.cypress.io/app/references/launching-browsers (WebKit experimentell über `experimentalWebKitSupport`), Browser Playwright https://playwright.dev/docs/browsers; übrige Zeilen vor Kursbeginn auf cypress.io und playwright.dev `prüfen`. Beide sind für EventHub geeignet; die Entscheidung hängt an Team-Erfahrung, Browser-Anforderungen (Safari/WebKit) und CI-Budget.

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| `The cypress npm package is installed, but the Cypress binary is missing.` | Binary nicht geladen | `npx cypress install` |
| `cy.visit() failed trying to load: http://localhost:4200/…` | `npm start` läuft nicht | Dev-Server starten, dann Test |
| `cy.request() failed … ECONNREFUSED 127.0.0.1:3000` | Mock-API läuft nicht | `npm run api` |
| `Timed out retrying after 4000ms: Expected to find element: [data-cy=…]` | Element erscheint zu spät oder Selektor falsch | Selektor im Inspector prüfen, langsame Antwort stubben oder Timeout erhöhen |
| `cy.wait() timed out waiting 5000ms for the 1st request to the route: search` | Intercept nach der Aktion registriert oder Muster passt nicht | `cy.intercept` vor `cy.visit`/`type`; `pathname` statt Glob |
| TypeScript meldet `expect` doppelt oder `cy` unbekannt | Cypress-Dateien von `tsconfig.spec.json` erfasst oder umgekehrt | Cypress nur über `cypress/tsconfig.json` prüfen (`npx tsc -p cypress/tsconfig.json`) |

## Fazit

- E2E-Tests sichern wenige kritische Abläufe im echten Browser ab; die Pyramide aus Lab 10.1 bleibt unten breit.
- `data-cy`, `cy.intercept` mit Alias und Login per `cy.session` machen Tests schnell und stabil.
- Fehlerfälle wie „API nicht erreichbar“ lassen sich ohne Eingriff in den Server per `cy.intercept` erzeugen.

Die Übung baut den Flow „Login → Session suchen → Favorit → Header-Zähler“ und den Fehlerfall „API nicht erreichbar“ als zwei grüne E2E-Tests.
