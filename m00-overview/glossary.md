# Glossar

Zentrale Begriffe aus den Handouts, alphabetisch. Die Spalte „Lab“ verweist auf die Stelle, an der der Begriff eingeführt wird; weitere Begriffe stehen in der Tabelle „Begriffe“ des jeweiligen Labs.

| Begriff | Bedeutung | Lab |
| --- | --- | --- |
| Access-Token | kurzlebiges Token für API-Aufrufe (Minuten) | [9.1](../m09-security/l01-tokens/l01-tokens-thx.md) |
| Action | Objekt `{ type: '[Quelle] Ereignis', ...daten }`, beschreibt, was passiert ist | [7.2](../m07-ngrx/l02-store/l02-store-thx.md) |
| `affected` | nur die Projekte, die von geänderten Dateien betroffen sind | [11.1](../m11-libraries/l01-nx/l01-nx-thx.md) |
| Angular Package Format | Standard-Aufbau eines Angular-Pakets (ES-Module, Typen, `package.json` mit `exports`) | [11.2](../m11-libraries/l02-library/l02-library-thx.md) |
| Angular Service Worker (`ngsw`) | fertiger Service Worker von Angular, gesteuert über `ngsw-config.json` | [12.3](../m12-microfrontends-pwa/l03-pwa/l03-pwa-thx.md) |
| App-Initializer | Funktion, auf deren Ergebnis Angular vor dem Erzeugen der Root-Komponente wartet | [2.2](../m02-standalone/l02-bootstrapping/l02-bootstrapping-thx.md) |
| `ApplicationConfig` | Objekt `{ providers: [...] }`, das `bootstrapApplication` übergeben wird | [2.2](../m02-standalone/l02-bootstrapping/l02-bootstrapping-thx.md) |
| Authorization Server | stellt nach dem Login Tokens aus (hier Keycloak); bei OIDC auch Identity Provider (IdP) genannt | [9.3](../m09-security/l03-oidc/l03-oidc-thx.md) |
| Budget | Größengrenze in `angular.json`; der Build warnt oder bricht ab, wenn ein Bundle sie überschreitet. | [13.1](../m13-performance-docker/l01-measure/l01-measure-thx.md) |
| `CanActivateFn` | Guard, der vor dem Aktivieren einer bereits gefundenen Route läuft | [9.2](../m09-security/l02-jwt/l02-jwt-thx.md) |
| `CanMatchFn` | Guard, der entscheidet, ob eine Route überhaupt passt; bei `false` sucht der Router weiter | [9.2](../m09-security/l02-jwt/l02-jwt-thx.md) |
| Change Detection | Angulars Abgleich von Komponentendaten mit dem DOM | [6.1](../m06-signals/l01-signals/l01-signals-thx.md) |
| Chunk | eine JavaScript-Datei der gebauten App; der Browser lädt sie bei Bedarf nach | [3.2](../m03-component-deep-dive/l02-defer/l02-defer-thx.md) |
| CI (Continuous Integration) | Jede Änderung wird automatisch gebaut und getestet, bevor sie in den Hauptzweig kommt. | [14.1](../m14-ci-transfer/l01-ci/l01-ci-thx.md) |
| CLS (Cumulative Layout Shift) | Summe der unerwarteten Verschiebungen sichtbarer Elemente, z. B. wenn ein Bild nachlädt und Text nach unten schiebt. | [13.1](../m13-performance-docker/l01-measure/l01-measure-thx.md) |
| Cold Observable | Startet seine Arbeit pro Abo neu, z. B. jede `HttpClient`-Anfrage | [5.1](../m05-rxjs/l01-marbles/l01-marbles-thx.md) |
| `combineLatest` | Kombiniert mehrere Ströme; sendet bei jeder Änderung ein Array mit dem jeweils letzten Wert jedes Stroms | [5.2](../m05-rxjs/l02-operators/l02-operators-thx.md) |
| `ComponentFixture` | Hülle um eine erzeugte Komponente: Zugriff auf Instanz (`componentInstance`), DOM (`nativeElement`) und `componentRef` | [10.2](../m10-testing/l02-component-tests/l02-component-tests-thx.md) |
| `computed` | Nur lesbares Signal, das aus anderen Signals berechnet wird; rechnet nur neu, wenn sich eine gelesene Quelle ändert | [6.1](../m06-signals/l01-signals/l01-signals-thx.md) |
| Control Flow Block | Template-Anweisung mit `@`, z. B. `@if (…) { … }`; vom Compiler übersetzt, kein Import nötig | [3.1](../m03-component-deep-dive/l01-control-flow/l01-control-flow-thx.md) |
| `ControlValueAccessor` | Interface mit vier Methoden, über die ein Formular mit einem Eingabe-Baustein spricht | [4.3](../m04-reactive-forms/l03-custom-control/l03-custom-control-thx.md) |
| Core Web Vitals | Drei Kennzahlen von Google für das Nutzungserlebnis: Laden (LCP), Reaktion (INP), visuelle Stabilität (CLS). | [13.1](../m13-performance-docker/l01-measure/l01-measure-thx.md) |
| Coverage | Anteil des Codes (Zeilen, Zweige, Funktionen), der beim Testlauf ausgeführt wurde | [10.1](../m10-testing/l01-strategy/l01-strategy-thx.md) |
| `createCustomElement()` | Funktion aus `@angular/elements`, die aus einer Komponente eine Custom-Element-Klasse macht | [11.3](../m11-libraries/l03-elements/l03-elements-thx.md) |
| Custom Element | eigenes HTML-Tag, das der Browser per `customElements.define()` kennt (Web-Components-Standard) | [11.3](../m11-libraries/l03-elements/l03-elements-thx.md) |
| `cy.intercept` | beobachtet oder ersetzt HTTP-Anfragen der App (Stub, Fehler, Verzögerung) | [10.5](../m10-testing/l05-cypress/l05-cypress-thx.md) |
| Cypress | E2E-Werkzeug; Tests laufen im Browser direkt neben der App und warten automatisch auf Elemente | [10.5](../m10-testing/l05-cypress/l05-cypress-thx.md) |
| `data-cy` | eigenes HTML-Attribut nur für Tests; ändert sich nicht, wenn CSS-Klassen oder Texte sich ändern | [10.5](../m10-testing/l05-cypress/l05-cypress-thx.md) |
| `DestroyRef` | Angular-Objekt, das zu einer Komponente (oder einem Service) gehört und meldet, wann sie zerstört wird | [5.3](../m05-rxjs/l03-debugging/l03-debugging-thx.md) |
| E2E-Test | prüft einen Ablauf so, wie Nutzende ihn erleben: Browser, App und Server zusammen | [10.5](../m10-testing/l05-cypress/l05-cypress-thx.md) |
| `effect` | Funktion, die bei jeder Änderung der gelesenen Signals erneut läuft; für Seiteneffekte nach außen | [6.1](../m06-signals/l01-signals/l01-signals-thx.md) |
| Effect | Observable, das auf Actions reagiert und meist neue Actions liefert; NgRx schickt diese automatisch an den Store | [7.3](../m07-ngrx/l03-effects/l03-effects-thx.md) |
| `@empty` | Zweig von `@for`, der erscheint, wenn die Liste leer ist | [3.1](../m03-component-deep-dive/l01-control-flow/l01-control-flow-thx.md) |
| Environment-Provider | Provider für den App-weiten Injector (Typ `EnvironmentProviders`); nur in `app.config.ts` oder an Routen erlaubt, nicht in `@Component.providers` | [2.2](../m02-standalone/l02-bootstrapping/l02-bootstrapping-thx.md) |
| `federation.manifest.json` | Datei des Hosts: Remote-Name → URL der `remoteEntry.json`; austauschbar ohne Build | [12.2](../m12-microfrontends-pwa/l02-native-federation/l02-native-federation-thx.md) |
| Flaky Test | Test, der ohne Codeänderung mal grün, mal rot ist | [10.5](../m10-testing/l05-cypress/l05-cypress-thx.md) |
| `FormField` | Direktive `[formField]`, verbindet ein `<input>` mit einem Feld | [6.4](../m06-signals/l04-signal-forms/l04-signal-forms-thx.md) |
| `form(model, schema?, options?)` | Erzeugt den Feldbaum (`FieldTree`) zum Modell; Paket `@angular/forms/signals` | [6.4](../m06-signals/l04-signal-forms/l04-signal-forms-thx.md) |
| `FormRoot` | Direktive `[formRoot]` auf `<form>`, verhindert das Neuladen und ruft beim Absenden die `submission`-Aktion auf | [6.4](../m06-signals/l04-signal-forms/l04-signal-forms-thx.md) |
| Guard | Funktion an einer Route, die entscheidet, ob navigiert werden darf | [9.2](../m09-security/l02-jwt/l02-jwt-thx.md) |
| Higher-Order-Operator | Operator, der pro Wert ein inneres Observable startet und die Ergebnisse in einen Strom zusammenführt (`switchMap`, `mergeMap`, `concatMap`, `exhaustMap`) | [5.2](../m05-rxjs/l02-operators/l02-operators-thx.md) |
| Host Directive | Direktive, die eine Komponente über `hostDirectives` fest auf ihr eigenes Host-Element setzt | [3.3](../m03-component-deep-dive/l03-directives/l03-directives-thx.md) |
| Host (Shell) | App, die Rahmen, Navigation und Login stellt und Micro-Frontends lädt | [12.1](../m12-microfrontends-pwa/l01-mfe-architecture/l01-mfe-architecture-thx.md) |
| `host`-Metadaten | Objekt im Decorator, das Klassen, Styles, Attribute und Events des Host-Elements bindet | [3.3](../m03-component-deep-dive/l03-directives/l03-directives-thx.md) |
| Hot Observable | Sendet unabhängig von Abos; wer später abonniert, verpasst frühere Werte, z. B. ein `Subject` | [5.1](../m05-rxjs/l01-marbles/l01-marbles-thx.md) |
| `HttpInterceptorFn` | Funktion `(req, next) => Observable`, die jede Anfrage eines `HttpClient` verändern oder beobachten kann | [9.2](../m09-security/l02-jwt/l02-jwt-thx.md) |
| `httpResource` | Resource für eine GET-Anfrage über `HttpClient`; die URL ist eine Funktion, die Signals lesen darf | [6.2](../m06-signals/l02-interop/l02-interop-thx.md) |
| `HttpTestingController` | Attrappe für das HTTP-Backend: Anfragen abfangen, prüfen, beantworten | [10.2](../m10-testing/l02-component-tests/l02-component-tests-thx.md) |
| ID-Token | JWT für den Client: wer sich angemeldet hat (Claims wie `name`, `email`) | [9.3](../m09-security/l03-oidc/l03-oidc-thx.md) |
| Import Map | JSON im Browser, das Paketnamen auf URLs abbildet (`"@angular/core": "/core.js"`) | [12.1](../m12-microfrontends-pwa/l01-mfe-architecture/l01-mfe-architecture-thx.md) |
| `import()` | dynamischer Import; der Build legt für die Zieldatei einen eigenen Chunk an | [8.1](../m08-advanced-routing/l01-lazy-loading/l01-lazy-loading-thx.md) |
| `importProvidersFrom(...)` | Brücke: holt die Provider aus NgModules in eine `ApplicationConfig` | [2.3](../m02-standalone/l03-migration/l03-migration-thx.md) |
| `inject()` | Funktion, die einen Dienst aus der Dependency Injection holt; ersetzt den Konstruktor-Parameter | [1.2](../m01-angular-recap/l02-recap/l02-recap-thx.md) |
| INP (Interaction to Next Paint) | Zeit von einer Eingabe (Klick, Taste) bis zur nächsten sichtbaren Reaktion; gemessen über den ganzen Besuch. | [13.1](../m13-performance-docker/l01-measure/l01-measure-thx.md) |
| `input()` | Signal-Input; Wert lesen mit `session()`, nur lesbar in der Kind-Komponente | [6.3](../m06-signals/l03-communication/l03-communication-thx.md) |
| JWT (JSON Web Token) | Token-Format aus drei Base64URL-Teilen `header.payload.signature` | [9.1](../m09-security/l01-tokens/l01-tokens-thx.md) |
| Lazy Chunk | Chunk, der nicht beim Start, sondern erst später geladen wird | [3.2](../m03-component-deep-dive/l02-defer/l02-defer-thx.md) |
| LCP (Largest Contentful Paint) | Zeit, bis das größte sichtbare Element (Bild, Textblock) gezeichnet ist. | [13.1](../m13-performance-docker/l01-measure/l01-measure-thx.md) |
| `@let` | lokale, schreibgeschützte Template-Variable, z. B. für ein Pipe-Ergebnis | [3.1](../m03-component-deep-dive/l01-control-flow/l01-control-flow-thx.md) |
| Lighthouse | In Chrome eingebautes Prüfwerkzeug, das eine Seite unter simulierter Drosselung lädt und bewertet. | [13.1](../m13-performance-docker/l01-measure/l01-measure-thx.md) |
| `linkedSignal` | Beschreibbares Signal, das bei Änderung seiner Quelle auf einen neu berechneten Wert zurückspringt | [6.1](../m06-signals/l01-signals/l01-signals-thx.md) |
| `loadChildren` | Routen-Eigenschaft: Funktion, die eine ganze Routen-Datei per `import()` nachlädt | [8.1](../m08-advanced-routing/l01-lazy-loading/l01-lazy-loading-thx.md) |
| `loadComponent` | Routen-Eigenschaft: Funktion, die eine Komponente per `import()` nachlädt | [8.1](../m08-advanced-routing/l01-lazy-loading/l01-lazy-loading-thx.md) |
| Marble-Diagramm | Zeitachse mit Werten als „Murmeln“; als Text: ein Zeichen pro Zeiteinheit | [5.1](../m05-rxjs/l01-marbles/l01-marbles-thx.md) |
| Micro-Frontend (MFE) | eigenständig gebauter und ausgelieferter Teil einer Oberfläche, meist ein Fachbereich | [12.1](../m12-microfrontends-pwa/l01-mfe-architecture/l01-mfe-architecture-thx.md) |
| `model()` | Input, den die Kind-Komponente auch schreiben darf; jede Änderung sendet `<name>Change` | [6.3](../m06-signals/l03-communication/l03-communication-thx.md) |
| Module Federation | Laden von Code anderer Builds zur Laufzeit, mit geteilten Abhängigkeiten | [12.1](../m12-microfrontends-pwa/l01-mfe-architecture/l01-mfe-architecture-thx.md) |
| Monorepo | ein Git-Repository mit mehreren Apps und Libraries, die gemeinsam versioniert werden | [11.1](../m11-libraries/l01-nx/l01-nx-thx.md) |
| Multi-Stage-Build | Mehrere `FROM`-Stufen in einem Dockerfile; das Ergebnis enthält nur die letzte Stufe. | [13.3](../m13-performance-docker/l03-docker/l03-docker-thx.md) |
| Native Federation | Module Federation auf Basis von Browser-Standards (ES-Module, Import Maps), unabhängig vom Bundler | [12.1](../m12-microfrontends-pwa/l01-mfe-architecture/l01-mfe-architecture-thx.md) |
| `ng-packagr` | Werkzeug hinter `ng build <lib>`; erzeugt ein npm-fähiges Paket | [11.2](../m11-libraries/l02-library/l02-library-thx.md) |
| `NG_VALUE_ACCESSOR` | Token, unter dem sich die Komponente als CVA anmeldet | [4.3](../m04-reactive-forms/l03-custom-control/l03-custom-control-thx.md) |
| `NgComponentOutlet` | Direktive `*ngComponentOutlet="Klasse; inputs: {...}"`: rendert die Klasse an dieser Stelle | [8.3](../m08-advanced-routing/l03-dynamic-components/l03-dynamic-components-thx.md) |
| nginx | Schlanker Webserver, liefert statische Dateien aus. | [13.3](../m13-performance-docker/l03-docker/l03-docker-thx.md) |
| `NgModule` | Klasse mit `@NgModule`, die Komponenten deklariert und anderen Modulen bereitstellt | [2.1](../m02-standalone/l01-standalone/l01-standalone-thx.md) |
| Nx | Build-System für Monorepos: Generatoren, Task-Ausführung, Cache, Projektgraph | [11.1](../m11-libraries/l01-nx/l01-nx-thx.md) |
| Observable | Quelle, die über die Zeit null bis viele Werte sendet und dann endet (complete), scheitert (error) oder ewig läuft | [5.1](../m05-rxjs/l01-marbles/l01-marbles-thx.md) |
| `output()` | Ereignis der Kind-Komponente; senden mit `.emit(wert)` | [6.3](../m06-signals/l03-communication/l03-communication-thx.md) |
| `peerDependencies` | Pakete, die die nutzende App bereitstellen muss (Angular selbst) | [11.2](../m11-libraries/l02-library/l02-library-thx.md) |
| PKCE („Pixie“) | Proof Key for Code Exchange: Zufallswert, der beweist, dass derselbe Client den Code einlöst | [9.3](../m09-security/l03-oidc/l03-oidc-thx.md) |
| Preloading | Lazy Chunks nach dem Start im Hintergrund laden, bevor jemand navigiert | [8.2](../m08-advanced-routing/l02-preloading/l02-preloading-thx.md) |
| `PreloadingStrategy` | Klasse mit Methode `preload(route, load)`; entscheidet pro Lazy-Route, ob und wann geladen wird | [8.2](../m08-advanced-routing/l02-preloading/l02-preloading-thx.md) |
| Projektgraph | Netz aus Projekten und ihren Importen; Grundlage für `affected` | [11.1](../m11-libraries/l01-nx/l01-nx-thx.md) |
| `provideMockStore` | aus `@ngrx/store/testing`: Store-Attrappe ohne Reducer und Effects; Zustand und Selector-Ergebnisse setzt der Test | [10.4](../m10-testing/l04-store-tests/l04-store-tests-thx.md) |
| Provider | Eintrag, der der Dependency Injection sagt, wie ein Dienst erzeugt wird | [1.1](../m01-angular-recap/l01-workspace/l01-workspace-thx.md) |
| `public-api.ts` | Einstiegsdatei der Library; nur ihre Exporte sind von außen nutzbar | [11.2](../m11-libraries/l02-library/l02-library-thx.md) |
| Race Condition | Ergebnis hängt davon ab, welche von mehreren parallelen Antworten zuletzt ankommt | [5.2](../m05-rxjs/l02-operators/l02-operators-thx.md) |
| Realm | abgeschlossener Bereich in Keycloak mit eigenen Clients, Benutzern und Rollen | [9.3](../m09-security/l03-oidc/l03-oidc-thx.md) |
| Reducer | reine Funktion `(zustand, action) => neuer Zustand`; kein HTTP, kein Zufall, keine Änderung am alten Objekt | [7.2](../m07-ngrx/l02-store/l02-store-thx.md) |
| Redux DevTools | Browser-Erweiterung, die jede Action und jeden Zustand anzeigt und zurückspulen kann | [7.2](../m07-ngrx/l02-store/l02-store-thx.md) |
| Refresh-Token | langlebiges Token, das nur gegen ein neues Access-Token getauscht wird | [9.1](../m09-security/l01-tokens/l01-tokens-thx.md) |
| Remote | Micro-Frontend, das Code zum Nachladen bereitstellt | [12.1](../m12-microfrontends-pwa/l01-mfe-architecture/l01-mfe-architecture-thx.md) |
| Resolver | Funktion an einer Route, die Daten vor dem Aktivieren der Route lädt | [8.3](../m08-advanced-routing/l03-dynamic-components/l03-dynamic-components-thx.md) |
| Resource | Objekt aus Signals für asynchrone Daten: `value()`, `status()`, `isLoading()`, `error()`, `hasValue()`, `reload()` | [6.2](../m06-signals/l02-interop/l02-interop-thx.md) |
| Router-Input | Routen- oder Query-Parameter, den der Router dank `withComponentInputBinding()` in einen gleichnamigen Input schreibt | [6.2](../m06-signals/l02-interop/l02-interop-thx.md) |
| `rxMethod` | Methode, die intern eine RxJS-Pipeline ist; nimmt einen Wert, ein Signal oder ein Observable | [7.4](../m07-ngrx/l04-signal-store/l04-signal-store-thx.md) |
| Schematic | Programm der Angular CLI, das Dateien erzeugt oder umschreibt; aufgerufen mit `ng generate <paket>:<name>` | [2.3](../m02-standalone/l03-migration/l03-migration-thx.md) |
| Secondary Entry Point | zweiter Importpfad im selben Paket, z. B. `eventhub-ui/testing` | [11.2](../m11-libraries/l02-library/l02-library-thx.md) |
| Selector | Funktion, die einen Teil des Zustands liest oder daraus etwas ableitet; Ergebnis wird zwischengespeichert | [7.2](../m07-ngrx/l02-store/l02-store-thx.md) |
| Semantic Versioning | Versionsschema `MAJOR.MINOR.PATCH` mit festen Regeln für Änderungen | [11.2](../m11-libraries/l02-library/l02-library-thx.md) |
| Service Worker | Script, das der Browser getrennt von der Seite ausführt; fängt Netzwerkanfragen ab und beantwortet sie aus dem Cache | [12.3](../m12-microfrontends-pwa/l03-pwa/l03-pwa-thx.md) |
| Shadow DOM | abgeschotteter DOM-Teilbaum: CSS der Seite wirkt nicht hinein, CSS der Komponente nicht hinaus | [11.3](../m11-libraries/l03-elements/l03-elements-thx.md) |
| Signal | Behälter für einen Wert, der meldet, wenn er sich ändert; Lesen mit `zahl()` | [6.1](../m06-signals/l01-signals/l01-signals-thx.md) |
| `signalStore(...)` | erzeugt eine injizierbare Store-Klasse aus Features (Bausteinen) | [7.4](../m07-ngrx/l04-signal-store/l04-signal-store-thx.md) |
| SPA-Fallback | Regel im Webserver: existiert keine Datei zum Pfad, wird `index.html` ausgeliefert. | [13.3](../m13-performance-docker/l03-docker/l03-docker-thx.md) |
| Speicherleck (Memory Leak) | Speicher und Arbeit, die nicht mehr gebraucht, aber auch nicht freigegeben werden; hier: Abos zerstörter Komponenten | [5.3](../m05-rxjs/l03-debugging/l03-debugging-thx.md) |
| Standalone-Komponente | Komponente, die ihre Abhängigkeiten selbst in `imports` nennt und kein NgModule braucht; Default seit Angular 19 | [1.1](../m01-angular-recap/l01-workspace/l01-workspace-thx.md) |
| Strukturelle Direktive | alte Form mit `*`, z. B. `*ngIf`; eine Klasse aus `@angular/common`, die importiert werden muss | [3.1](../m03-component-deep-dive/l01-control-flow/l01-control-flow-thx.md) |
| `Subject` | Observable, in das Code selbst Werte schiebt (`next()`); mehrere Abonnenten teilen sich dieselben Werte | [5.1](../m05-rxjs/l01-marbles/l01-marbles-thx.md) |
| `SwUpdate` | Angular-Service, der neue Versionen meldet und aktiviert | [12.3](../m12-microfrontends-pwa/l03-pwa/l03-pwa-thx.md) |
| `takeUntilDestroyed()` | Operator aus `@angular/core/rxjs-interop`, der den Strom beendet, wenn der zugehörige `DestroyRef` meldet | [5.3](../m05-rxjs/l03-debugging/l03-debugging-thx.md) |
| TBT (Total Blocking Time) | Summe der Zeit, in der lange Aufgaben (> 50 ms) den Haupt-Thread blockieren; Labor-Ersatz für INP. | [13.1](../m13-performance-docker/l01-measure/l01-measure-thx.md) |
| Test-Runner | Programm, das Testdateien findet, ausführt und das Ergebnis meldet (Karma, Vitest) | [10.1](../m10-testing/l01-strategy/l01-strategy-thx.md) |
| `TestBed` | Test-Injector von Angular: stellt Provider bereit und erzeugt Komponenten wie in der App | [10.2](../m10-testing/l02-component-tests/l02-component-tests-thx.md) |
| `TestScheduler` | RxJS-Scheduler für Tests: führt alle zeitbasierten Operatoren in virtueller Zeit aus | [10.3](../m10-testing/l03-marble-testing/l03-marble-testing-thx.md) |
| `toObservable(sig)` | macht aus einem Signal ein Observable, das bei jeder Änderung sendet | [6.2](../m06-signals/l02-interop/l02-interop-thx.md) |
| `toSignal(obs$)` | abonniert ein Observable und stellt den letzten Wert als Signal bereit; beendet das Abo beim Zerstören | [6.2](../m06-signals/l02-interop/l02-interop-thx.md) |
| `track` | Ausdruck, der einen Listeneintrag eindeutig kennzeichnet, ähnlich einem Primärschlüssel in einer Tabelle | [3.1](../m03-component-deep-dive/l01-control-flow/l01-control-flow-thx.md) |
| `unprotected` | aus `@ngrx/signals/testing`: erlaubt `patchState` von außen auf einen Signal Store, nur für Tests | [10.4](../m10-testing/l04-store-tests/l04-store-tests-thx.md) |
| `ViewContainerRef` | Stelle im Template, an der Code Komponenten einfügen, verschieben und entfernen kann | [8.3](../m08-advanced-routing/l03-dynamic-components/l03-dynamic-components-thx.md) |
| Vitest | Test-Runner und Assertion-Bibliothek; läuft in Node.js mit jsdom (simuliertes DOM) statt in einem echten Browser | [10.1](../m10-testing/l01-strategy/l01-strategy-thx.md) |
| Web App Manifest | JSON-Datei mit Name, Icons, Farben, Startadresse; macht die App installierbar | [12.3](../m12-microfrontends-pwa/l03-pwa/l03-pwa-thx.md) |
| Web Components | Browser-Standards für eigene Elemente: Custom Elements, Shadow DOM, Templates | [11.3](../m11-libraries/l03-elements/l03-elements-thx.md) |
| `withComponentInputBinding()` | Router-Option: Pfad- und Query-Parameter landen automatisch in gleichnamigen `@Input`s der Routen-Komponente | [1.2](../m01-angular-recap/l02-recap/l02-recap-thx.md) |
| `withEntities` | Sammlung von Objekten mit `id`, gespeichert als `ids` und `entityMap`, lesbar als `entities()` | [7.4](../m07-ngrx/l04-signal-store/l04-signal-store-thx.md) |
| `withEventHandlers(...)` | Seiteneffekte bei Events (bis NgRx 20: `withEffects`) | [7.5](../m07-ngrx/l05-events/l05-events-thx.md) |
| `withPreloading(…)` | Router-Feature in `provideRouter`; aktiviert eine Strategie | [8.2](../m08-advanced-routing/l02-preloading/l02-preloading-thx.md) |
| `withReducer(on(event, fn))` | Zustandsübergang bei einem Event im Signal Store | [7.5](../m07-ngrx/l05-events/l05-events-thx.md) |
| zone.js | Bibliothek, die früher jede asynchrone Aktion (Klick, Timer, HTTP) abfing und danach die Ansicht prüfen ließ | [1.1](../m01-angular-recap/l01-workspace/l01-workspace-thx.md) |
| zoneless | Betrieb ohne zone.js: Angular prüft die Ansicht nur nach konkreten Anlässen (Event im Template, `async`-Pipe, Input-Änderung, Signal) | [1.1](../m01-angular-recap/l01-workspace/l01-workspace-thx.md) |
