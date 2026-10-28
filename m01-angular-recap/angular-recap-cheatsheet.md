# Angular-Recap-Cheatsheet

Schnellreferenz für Modul 1 (Kurs-Workspace, Komponenten, Bindings, Services, Routing).

## Kurs-Projekt

| Befehl / Adresse | Wirkung |
| --- | --- |
| `npm install` | Abhängigkeiten installieren (im Ordner `project/`) |
| `npm run api` | Mock-API auf http://localhost:3000 |
| `npm start` | App auf http://localhost:4200 (`ng serve`) |
| `npm start -- --port 4300` | App auf anderem Port |
| `npx ngc -p tsconfig.app.json --noEmit` | Typprüfung inklusive Templates |
| `/playground` | eigene Arbeit aus `src/app/playground/playground.ts` |
| `/examples/<modul>/<lab>` | fertiges Beispiel |
| `cp src/app/starters/<starter>.ts src/app/playground/playground.ts` | Starter übernehmen |
| `git restore src/app/playground/` | Playground zurücksetzen (Git-Klon) |

## Projektstruktur Angular 22

| Datei | Inhalt |
| --- | --- |
| `src/main.ts` | `bootstrapApplication(App, appConfig)` |
| `src/app/app.config.ts` | `ApplicationConfig` mit `providers` |
| `src/app/app.routes.ts` | `export const routes: Routes = [...]` |
| `src/app/app.ts` | Root-Komponente `App`, Selektor `app-root` |
| `angular.json` | Builder `@angular/build:application`, kein zone.js in `polyfills` |
| `VERSION.full` (aus `@angular/core`) | laufende Angular-Version |

## Zoneless-Regel bis Modul 6

| Code | Wirkung |
| --- | --- |
| `sessions$ = this.api.getSessions();` | Observable im Feld halten |
| `@if (sessions$ \| async; as sessions) { … } @else { … }` | auflösen, Ladezustand im `@else` |
| `.subscribe((s) => (this.sessions = s))` | Fehler: Anzeige aktualisiert sich zoneless nicht |
| `(click)="…"` | Event-Handler im Template löst Aktualisierung aus |

## Control Flow (Recap, Vertiefung Lab 3.1)

| Syntax | Wirkung |
| --- | --- |
| `@if (bedingung) { … } @else { … }` | bedingte Anzeige |
| `@if (obs$ \| async; as wert) { … }` | Observable auflösen und benennen |
| `@for (s of liste; track s.id) { … }` | Liste ausgeben, `track` ist Pflicht |

## Bindings

| Syntax | Wirkung |
| --- | --- |
| `{{ session.title }}` | Interpolation (Text) |
| `[session]="session"` | Property-Binding: Objekt an `@Input` |
| `session="session"` | Fehler: übergibt den Text `"session"` |
| `(click)="onFavorite()"` | Event-Binding |
| `(toggleFavorite)="favorites.toggle($event)"` | `@Output` abonnieren, `$event` = Wert aus `emit` |

## Komponenten-Kommunikation (klassisch)

| Syntax | Wirkung |
| --- | --- |
| `@Input() isFavorite = false;` | Eingabe mit Default |
| `@Input({ required: true }) session!: Session;` | Pflicht-Eingabe |
| `@Output() toggleFavorite = new EventEmitter<number>();` | Ereignis nach oben |
| `this.toggleFavorite.emit(id)` | Ereignis auslösen |
| `imports: [SessionCard]` | Kindkomponente im Template verfügbar machen |
| `ngOnChanges()` | läuft bei jeder Input-Änderung |
| `ngOnInit()` | läuft einmal nach dem ersten Setzen der Inputs |

## Pipes

| Syntax | Wirkung |
| --- | --- |
| `imports: [DatePipe, AsyncPipe]` | Pipes aus `@angular/common` verfügbar machen |
| `{{ d \| date: 'dd.MM.yyyy, HH:mm' }}` | `10.03.2027, 09:30` |
| `MM` / `mm` | Monat / Minuten |
| `{{ x \| uppercase }}`, `{{ p \| currency: 'EUR' }}` | Großschreibung, Währung |

## Services und DI

| Syntax | Wirkung |
| --- | --- |
| `@Injectable({ providedIn: 'root' })` | Service app-weit bereitstellen |
| `private readonly api = inject(SessionApi);` | Service holen (Feld-Initialisierung) |
| `constructor(private api: SessionApi) {}` | klassische Schreibweise |
| `providers: [FavoritesService]` im `@Component` | eigene Instanz für Komponente und Kinder |
| `NG0201: No provider found for …` | Service ohne Provider |

## Routing

| Syntax | Wirkung |
| --- | --- |
| `{ path: 'sessions/:id', component: Detail }` | Route mit Pfad-Parameter |
| `[routerLink]="['/sessions', s.id]"` | Link auf `/sessions/3` |
| `[routerLink]="[]" [queryParams]="{ id: s.id }"` | aktuelle Route mit `?id=3` |
| `[routerLink]="[]"` | aktuelle Route ohne Query-Parameter |
| `provideRouter(routes, withComponentInputBinding())` | Parameter als `@Input` der Routen-Komponente |
| `@Input() id?: string;` | Parameter lesen (immer Text) |
| `inject(ActivatedRoute).snapshot.paramMap.get('id')` | klassisch lesen |

## Fehlercodes

| Code | Bedeutung |
| --- | --- |
| `NG8001` | unbekanntes Element: Komponente fehlt in `imports` |
| `NG8002` | unbekannte Eigenschaft im Binding |
| `NG8004` | Pipe fehlt in `imports` |
| `TS2322` | Typfehler, z. B. Text statt Objekt |
| `NG0201` | Laufzeit: kein Provider |
