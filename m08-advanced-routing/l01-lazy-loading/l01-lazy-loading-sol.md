# Lab 8.1 – Lösung: Lazy Loading mit loadComponent und loadChildren

Fertiges Ergebnis: `src/app/examples/m08-advanced-routing/l01-lazy-loading/` (Ordner `eventhub/`), in der Kurs-App unter http://localhost:4200/examples/m08-advanced-routing/l01-lazy-loading.

## Aufgabe 1: Ausgangszustand prüfen

Alle vier Seiten laden; die Navigation steckt in `eventhub/shell.ts` und nutzt relative Links (`routerLink="speakers"`).

## Aufgabe 2: Erste Messung

```text
Initial chunk files | Names         |  Raw size | Estimated transfer size
main-4WKOFHEX.js    | main          | 327.38 kB |                88.18 kB
styles-YGSHSUSE.css | styles        |   1.75 kB |               644 bytes

                    | Initial total | 329.13 kB |                88.82 kB
```

Keine Tabelle „Lazy chunk files“: Alles steckt in `main`. Die Werte können je nach Patch-Version um wenige kB abweichen.

## Aufgabe 3: Admin per loadComponent

```ts
{
  path: 'admin',
  title: 'Admin',
  loadComponent: () => import('./admin/admin-page').then((m) => m.AdminPage),
},
```

Der Import `import { AdminPage } from './admin/admin-page';` oben in der Datei ist gelöscht. Bliebe er stehen, wäre `AdminPage` weiter im Start-Bundle.

## Aufgabe 4: Routen-Datei des Speaker-Features

```ts
// eventhub/speakers/speakers.routes.ts
import { Routes } from '@angular/router';
import { SpeakerDetail } from './speaker-detail';
import { SpeakerList } from './speaker-list';

export default [
  { path: '', title: 'Speaker', component: SpeakerList },
  { path: ':id', title: 'Speaker', component: SpeakerDetail },
] satisfies Routes;
```

Innerhalb der Feature-Datei sind statische Imports richtig: Die ganze Datei ist bereits ein Lazy Chunk.

## Aufgabe 5: Speaker per loadChildren

```ts
// eventhub/eventhub.routes.ts (vollständig)
import { Routes } from '@angular/router';
import { SessionsPage } from './sessions/sessions-page';
import { SessionsStore } from './sessions/sessions-store';
import { Shell } from './shell';

export const EVENTHUB_ROUTES: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'sessions' },
      { path: 'sessions', title: 'Sessions', component: SessionsPage, providers: [SessionsStore] },
      { path: 'speakers', loadChildren: () => import('./speakers/speakers.routes') },
      {
        path: 'admin',
        title: 'Admin',
        loadComponent: () => import('./admin/admin-page').then((m) => m.AdminPage),
      },
    ],
  },
];

export default EVENTHUB_ROUTES;
```

`providers: [SessionsStore]` gehört zu Aufgabe 7. Der Link `[routerLink]="[sp.id]"` in der Liste bleibt unverändert: relativ zu `speakers` ergibt er `speakers/3`.

## Aufgabe 6: Nachweis im Browser

| Aktion | Network-Tab (Filter JS) |
| --- | --- |
| Neuladen auf `/sessions` | `main.js` (Dev-Server: zusätzlich Vite-Dateien), kein Admin-Chunk |
| erster Klick „Admin“ | neue Datei `chunk-….js` (Name nur aus Hash) plus ein Eintrag `@ng/component?c=…admin-page.ts…` (Hot Reload des Dev-Servers) |
| zweiter Klick „Admin“ | keine neue Datei, der Chunk ist im Speicher |
| erster Klick „Speaker“ | wieder eine neue `chunk-….js` plus `@ng/component?c=…speaker-list.ts…` |

Welcher Chunk was enthält, zeigt erst `npx ng build` in der Spalte `Names` (Aufgabe 9).

## Aufgabe 7: Store nur im Sessions-Feature

```ts
// eventhub/sessions/sessions-store.ts
// Ohne providedIn: Der Store existiert nur dort, wo eine Route ihn in "providers" einträgt.
export const SessionsStore = signalStore(
  withState({ sessions: [] as Session[], loading: false }),
  withComputed(({ sessions }) => ({ count: computed(() => sessions().length) })),
  withMethods((store, http = inject(HttpClient)) => ({
    load(): void {
      patchState(store, { loading: true });
      http.get<Session[]>(`${API_URL}/sessions`).subscribe((sessions) => patchState(store, { sessions, loading: false }));
    },
  })),
  withHooks({ onInit(store) { console.log('[SessionsStore] erzeugt'); store.load(); } }),
);
```

Die Route trägt `providers: [SessionsStore]` (siehe Aufgabe 5). `[SessionsStore] erzeugt` erscheint beim ersten Besuch von `/sessions` und nicht erneut nach einem Wechsel zu Speaker und zurück: Der Routen-Injector bleibt bestehen.

## Aufgabe 8: Store außerhalb des Features

Die Konsole zeigt beim Klick auf „Admin“:

```text
ERROR ɵNotFound: NG0201: No provider found for `SignalStore`. Source: Standalone[_AdminPage]. Find more at https://v22.angular.dev/errors/NG0201
```

`SignalStore` ist der interne Name jedes `signalStore`. Die Navigation bricht ab: Die URL bleibt `/sessions`, die Admin-Seite erscheint nicht und die Session-Liste verschwindet; nur die Navigation bleibt sichtbar. Grund: Die Admin-Route ist ein Geschwister von `sessions`, nicht ihr Kind; ihr Injector kennt den Store nicht.

## Aufgabe 9: Zweite Messung

```text
Initial chunk files | Names           |  Raw size | Estimated transfer size
main-DRF3KWKK.js    | main            | 292.97 kB |                80.38 kB
styles-YGSHSUSE.css | styles          |   1.75 kB |               644 bytes

                    | Initial total   | 294.72 kB |                81.02 kB

Lazy chunk files    | Names           |  Raw size | Estimated transfer size
chunk-C7IgMoPv.js   | admin-page      |  37.81 kB |                 9.06 kB
chunk-Vs3N4Efk.js   | speakers-routes |   1.75 kB |               804 bytes
chunk-B1gJeuRx.js   | -               | 683 bytes |               683 bytes
```

| Messung | Initial total (raw) | Initial total (transfer) |
| --- | --- | --- |
| vorher | 329.13 kB | 88.82 kB |
| nachher | 294.72 kB | 81.02 kB |
| Differenz | −34.41 kB | −7.80 kB |

Der Admin-Chunk enthält `@angular/forms` (Reactive Forms), das sonst niemand nutzt. Der Chunk `-` ist Code, den mehrere Lazy Chunks teilen.

## Erweiterung

```ts
// admin/admin-page.ts
export default class AdminPage { /* unverändert */ }

// eventhub.routes.ts
{ path: 'admin', loadComponent: () => import('./admin/admin-page') },
```

`loadComponent` und `loadChildren` nutzen automatisch den `default`-Export, wenn die Funktion das Modul liefert. `--verbose` zeigt dieselben Chunks; bei mehr als 15 Lazy Chunks kürzt die normale Ausgabe mit „…and N more lazy chunks files“.
