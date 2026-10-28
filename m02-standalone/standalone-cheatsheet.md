# Standalone-Cheatsheet

Schnellreferenz für Modul 2 (Standalone-Bausteine, Bootstrapping, Migration).

## Standalone-Bausteine

| Syntax | Wirkung |
| --- | --- |
| `@Component({ selector, imports: [...], template })` | Standalone-Komponente (Default seit v19) |
| `standalone: false` | Altcode: Baustein gehört zu einem NgModule |
| `@Pipe({ name: 'duration' })` | Standalone-Pipe |
| `imports: [NgClass, AsyncPipe, DatePipe]` | einzelne Bausteine aus `@angular/common` statt `CommonModule` |
| `imports: [SharedModule]` | Mischbetrieb: NgModule in Standalone-Komponente |
| `@NgModule({ imports: [LevelBadge], exports: [LevelBadge] })` | Mischbetrieb: Standalone-Baustein über Modul weiterreichen |
| `export const SESSION_UI = [LevelBadge, DurationPipe] as const;` | Bündeln ohne Modul, `imports: [SESSION_UI]` |

| Meldung | Bedeutung |
| --- | --- |
| `NG6008 … is standalone, and cannot be declared in an NgModule` | aus `declarations` entfernen |
| `NG6004 Can't be exported from this NgModule, as it must be imported first` | Baustein in `imports` des Moduls, bevor er exportiert wird |
| `NG8002 Can't bind to 'ngClass' …` | `NgClass` fehlt in `imports` |

## Bootstrapping

| Syntax | Wirkung |
| --- | --- |
| `bootstrapApplication(App, appConfig)` | App starten (`src/main.ts`) |
| `platformBrowser().bootstrapModule(AppModule)` | Altcode: Start über NgModule (früher `platformBrowserDynamic()`) |
| `export const appConfig: ApplicationConfig = { providers: [...] }` | zentrale Provider-Liste |
| `provideRouter(routes, withComponentInputBinding())` | Router, Parameter als `@Input` |
| `provideHttpClient(withFetch())` | HttpClient über fetch |
| `provideHttpClient(withInterceptors([...]))` | Interceptors (Lab 9.2) |
| `provideBrowserGlobalErrorListeners()` | globale Fehler an den `ErrorHandler` |
| `provideZonelessChangeDetection()` | zoneless; in Angular 22 Default, Eintrag nicht nötig |
| `provideZoneChangeDetection({ eventCoalescing: true })` | Betrieb mit zone.js (Altprojekte) |
| `export const routes: Routes = [...]` | Routen in `app.routes.ts` |
| `export default [...] satisfies Routes` | Routen-Datei für `loadChildren: () => import('./x.routes')` |

## Eigener Provider und App-Initializer

| Syntax | Wirkung |
| --- | --- |
| `function provideXyz(): EnvironmentProviders` | eigene Provider-Funktion |
| `makeEnvironmentProviders([Service, …])` | Provider-Liste verpacken |
| `provideAppInitializer(() => inject(S).load(url))` | Start wartet auf Observable/Promise |
| `() => { inject(S).load(url); }` | Fehler: nichts zurückgegeben, Start wartet nicht |
| `this.http.get<T>(url).pipe(tap((v) => …))` | Wert merken, unverändert weitergeben |
| `catchError(() => of(DEFAULT))` | Fehler im Initializer durch Standardwert ersetzen |
| `public/config.json` → `/config.json` | Laufzeit-Konfiguration, ohne Neubau austauschbar |
| `bootstrapApplication(Root, config)` | weitere App-Instanz auf derselben Seite (Mini-App im Playground) |
| `appRef.destroy()` | App-Instanz beenden |

## Migrations-Schematics

| Befehl | Wirkung |
| --- | --- |
| `npx ng generate @angular/core:standalone` | interaktiv: Modus und Pfad wählen |
| `… --mode=convert-to-standalone --path=./` | Schritt 1: Bausteine standalone, `imports` eintragen |
| `… --mode=prune-ng-modules --path=./` | Schritt 2: leere Module löschen |
| `… --mode=standalone-bootstrap --path=./` | Schritt 3: `bootstrapApplication`, `AppModule` löschen |
| `--path=src/app/sessions` | nur einen Ordner migrieren |
| `npx ng generate @angular/core:control-flow` | `*ngIf`/`*ngFor` → `@if`/`@for` |
| `npx ng generate @angular/core:inject` | Konstruktor-Injection → `inject()` |
| `npx ng generate @angular/core:cleanup-unused-imports` | ungenutzte Einträge in `imports` entfernen |
| `importProvidersFrom(XyzModule)` | Brücke: Provider eines Moduls in `ApplicationConfig` |

## Migrationsablauf

| Befehl | Wirkung |
| --- | --- |
| `npm run build` | nach jedem Schritt: Build grün? |
| `git diff -- .` | Änderungen des Schritts lesen |
| `git add . && git commit -m "Schritt N"` | Schritt sichern |
| `git restore --staged --worktree -- . && git clean -fd -- src` | auf letzten Commit zurück |
| `npm start -- --port 4300` | Workspace parallel zur Kurs-App starten |
