# Advanced-Routing-Cheatsheet

Schnellreferenz für Modul 8 (Lazy Loading, Preloading, dynamische Komponenten).

## Workspace eventhub-lab

| Befehl | Wirkung |
| --- | --- |
| `cd workspaces/eventhub-lab` | in die Lab-App mit eigener Root-Konfiguration wechseln |
| `npx ng serve` | Lab-App auf http://localhost:4201 starten |
| `npx ng build` | Produktions-Build mit Tabelle der Chunks |
| `npx ng build --verbose` | alle Lazy Chunks statt der größten 15 |
| `npx ng build --stats-json` | `stats.json` für Bundle-Analyse-Werkzeuge schreiben |

## Build-Ausgabe lesen

| Eintrag | Bedeutung |
| --- | --- |
| `Initial chunk files` | Dateien, die beim Start laden |
| `Initial total` | Summe der Initial Chunks (Raw / Estimated transfer size) |
| `Lazy chunk files` | Dateien, die erst bei Bedarf laden |
| `Names` = `admin-page` | Chunk-Name aus dem Dateinamen der Zieldatei von `import()` |
| `Names` = `-` | gemeinsamer Code mehrerer Chunks |

## Lazy Loading

| Syntax | Wirkung |
| --- | --- |
| `{ path: 'admin', component: AdminPage }` | statisch: Komponente im Start-Bundle |
| `loadComponent: () => import('./admin/admin-page').then((m) => m.AdminPage)` | eine Komponente als Lazy Chunk |
| `loadComponent: () => import('./admin/admin-page')` | dasselbe, wenn die Klasse `export default` ist |
| `loadChildren: () => import('./speakers/speakers.routes')` | Routen-Datei mit `export default [...]` als Lazy Chunk |
| `loadChildren: () => import('./x.routes').then((m) => m.X_ROUTES)` | Routen-Datei mit benanntem Export |
| `export default [ … ] satisfies Routes;` | Routen-Datei eines Features |
| `routerLink="speakers"` / `[routerLink]="[sp.id]"` | relative Links, unabhängig vom Präfix der Route |

## Provider pro Route

| Syntax | Wirkung |
| --- | --- |
| `signalStore({ providedIn: 'root' }, …)` | Store für die ganze App |
| `signalStore(withState(…), …)` + `providers: [SessionsStore]` an der Route | Store nur für diese Route und ihre Kinder |
| `NG0201: No provider found for …` | Injektion außerhalb des Bereichs, in dem der Provider steht |
| `withAutoCleanupInjectors()` in `provideRouter` | Routen-Injectors aufräumen (seit Angular 22.2) |

## Preloading

| Syntax | Wirkung |
| --- | --- |
| `provideRouter(routes, withPreloading(PreloadAllModules))` | alle Lazy-Routen nach dem Start vorladen |
| `withPreloading(NoPreloading)` / kein `withPreloading` | nur bei Navigation laden |
| `withPreloading(DelayedPreloading)` | eigene Strategie aktivieren (nur in der Root-Konfiguration) |
| `class X implements PreloadingStrategy { preload(route, load) {…} }` | eigene Strategie |
| `return of(null);` | Route nicht vorladen |
| `return load();` | Route jetzt vorladen |
| `return timer(2000).pipe(switchMap(() => load()));` | nach 2 s vorladen |
| `data: { preload: true }` | Markierung an der Route |
| `route.data?.['preload']` | Markierung lesen (Index-Zugriff) |

## Dynamische Komponenten

| Syntax | Wirkung |
| --- | --- |
| `Record<string, () => Promise<Type<unknown>>>` | Registry: Typ → Ladefunktion |
| `() => import('./widgets/stats-widget').then((m) => m.StatsWidget)` | Widget als eigener Chunk |
| `imports: [NgComponentOutlet]` | Direktive bereitstellen |
| `<ng-container *ngComponentOutlet="klasse; inputs: werte" />` | Komponente aus dem Template rendern, Inputs setzen |
| `viewChild.required('host', { read: ViewContainerRef })` | Einfügestelle im Code holen |
| `const ref = vcr.createComponent(Klasse);` | Komponente im Code erzeugen |
| `ref.setInput('title', 'Auslastung');` | Input setzen |
| `vcr.clear()` / `ref.destroy()` | alle bzw. eine Komponente entfernen |
| `resource({ params: () => …, loader: ({ params }) => Promise })` | Klassen asynchron laden, Ergebnis als Signal |

## Resolver und Router-Inputs

| Syntax | Wirkung |
| --- | --- |
| `export const r: ResolveFn<T> = () => inject(HttpClient).get<T>(url);` | Daten vor dem Aktivieren laden |
| `resolve: { config: r }` | Ergebnis unter dem Schlüssel `config` |
| `readonly config = input.required<T>();` | erhält den Wert über `withComponentInputBinding()` |
| `readonly id = input.required<string>();` | Pfad-Parameter `:id` als Input |
| `readonly q = input<string>();` | Query-Parameter `?q=` als Input |
