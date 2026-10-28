# Lab 8.1 – Übung: Lazy Loading mit loadComponent und loadChildren

**Dauer:** ca. 17 Minuten
**Ändert die EventHub-Projektbasis?** Ja — im Workspace `eventhub-lab` werden Admin und Speaker zu Lazy-Features; Lab 8.2 baut darauf auf.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api`.
- Terminal 2 im Ordner `output/project/workspaces/eventhub-lab/`: `npx ng serve` (Port 4201). Die Kurs-App (`npm start`, Port 4200) darf parallel laufen.
- Terminal 3 im Ordner `output/project/workspaces/eventhub-lab/` für `npx ng build`.
- Arbeitsordner: `workspaces/eventhub-lab/src/app/eventhub/`
- Starter: Ausgangszustand des Workspace; Kopie zum Zurücksetzen in `src/app/starters/m08-l01-lazy-loading/` (Ordner `eventhub/` und `app.config.ts`).
- Browser: http://localhost:4201, DevTools mit Tab „Network“ (Filter `JS`).

## Aufgaben

1. Öffne http://localhost:4201 und klicke Sessions, Speaker, einen Speaker-Namen und Admin durch. Alle Seiten funktionieren.
2. Führe in Terminal 3 `npx ng build` aus und notiere „Initial total“ (Raw size und Estimated transfer size) sowie, ob es eine Tabelle „Lazy chunk files“ gibt.
3. Ersetze in `eventhub/eventhub.routes.ts` die Admin-Route durch eine Route mit `loadComponent`. Entferne den statischen Import von `AdminPage`.
4. Lege `eventhub/speakers/speakers.routes.ts` an: ein `export default` mit den Routen `''` (Liste) und `':id'` (Detail).
5. Ersetze die beiden Speaker-Routen in `eventhub.routes.ts` durch eine Route `speakers` mit `loadChildren`. Entferne die statischen Imports von `SpeakerList` und `SpeakerDetail`.
6. Prüfe im Browser mit geöffnetem Network-Tab: Beim Neuladen von `/sessions` erscheint kein Admin-Chunk; der erste Klick auf „Admin“ lädt eine zusätzliche JS-Datei, der zweite nicht mehr.
7. Entferne in `eventhub/sessions/sessions-store.ts` das `{ providedIn: 'root' }` und trage `SessionsStore` in `providers` der Route `sessions` ein. Die Session-Liste lädt weiter.
8. Füge testweise in `admin/admin-page.ts` die Zeile `private readonly store = inject(SessionsStore);` ein (Import ergänzen), öffne den Admin-Bereich und notiere die Meldung in der Konsole. Entferne die Zeile wieder.
9. Führe `npx ng build` erneut aus und notiere „Initial total“ sowie die Namen und Größen der Lazy Chunks.

## Checkpoint

- `npx ng build` zeigt die Tabelle „Lazy chunk files“ mit `admin-page` und `speakers-routes`.
- „Initial total“ ist kleiner als in Aufgabe 2.
- Der Admin-Chunk erscheint im Network-Tab erst beim Klick auf „Admin“.
- Aufgabe 8: Konsole zeigt `` NG0201: No provider found for `SignalStore`. Source: Standalone[_AdminPage] ``; die URL bleibt `/sessions`, die Session-Liste verschwindet.

## Abschlusskriterien

- `eventhub.routes.ts` importiert nur noch `Shell`, `SessionsPage` und `SessionsStore` statisch.
- Speaker-Liste, Speaker-Detail und Admin funktionieren wie vorher.
- Vorher-/Nachher-Werte von „Initial total“ sind notiert.

## Erweiterung (optional)

- Stelle `admin-page.ts` auf `export default class AdminPage` um und verkürze die Route auf `loadComponent: () => import('./admin/admin-page')`.
- Führe `npx ng build --verbose` aus und vergleiche die Liste der Lazy Chunks mit der Kurzfassung.

## Fallback

- Zustand zurücksetzen: Ordner `src/app/starters/m08-l01-lazy-loading/eventhub/` und `app.config.ts` nach `workspaces/eventhub-lab/src/app/` kopieren.
- Ergebnis übernehmen: Ordner `src/app/examples/m08-advanced-routing/l01-lazy-loading/eventhub/` nach `workspaces/eventhub-lab/src/app/` kopieren.
- Startet der Workspace nicht (Port 4201 belegt): `npx ng serve --port 4202`.
