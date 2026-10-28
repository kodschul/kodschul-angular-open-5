# Lab 8.2 – Übung: Preloading-Strategien

**Dauer:** ca. 13 Minuten
**Ändert die EventHub-Projektbasis?** Ja — der Workspace `eventhub-lab` lädt Speaker im Hintergrund vor; Lab 9.2 baut darauf auf.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api`.
- Terminal 2 im Ordner `output/project/workspaces/eventhub-lab/`: `npx ng serve` (Port 4201).
- Arbeitsdateien: `workspaces/eventhub-lab/src/app/app.config.ts`, `workspaces/eventhub-lab/src/app/eventhub/eventhub.routes.ts`, neue Datei `workspaces/eventhub-lab/src/app/eventhub/delayed-preloading.ts`
- Starter: Ergebnis von Lab 8.1. Ohne dieses Ergebnis den Ordner `src/app/examples/m08-advanced-routing/l01-lazy-loading/eventhub/` nach `workspaces/eventhub-lab/src/app/` kopieren.
- Browser: http://localhost:4201, DevTools mit Tab „Network“ (Filter `JS`, „Disable cache“ aktiv) und Tab „Console“.

## Aufgaben

1. Ergänze in `app.config.ts` bei `provideRouter` das Feature `withPreloading(PreloadAllModules)`. Lade `/sessions` neu, ohne zu klicken, und notiere, welche Lazy Chunks erscheinen.
2. Lege `eventhub/delayed-preloading.ts` mit einer Klasse `DelayedPreloading` an, die `PreloadingStrategy` implementiert: Routen ohne `data.preload === true` werden nicht geladen, markierte Routen erst nach 2 Sekunden. Gib vor dem Laden eine Zeile in der Konsole aus.
3. Ersetze `PreloadAllModules` in `app.config.ts` durch `DelayedPreloading`.
4. Ergänze in `eventhub.routes.ts` an der Route `speakers` die Eigenschaft `data: { preload: true }` und an `admin` `data: { preload: false }`.
5. Lade `/sessions` neu und beobachte Konsole und Network-Tab etwa 5 Sekunden lang, ohne zu klicken.
6. Klicke auf „Speaker“, danach auf „Admin“. Notiere, bei welchem Klick ein neuer Request entsteht.
7. Stelle die Drosselung im Network-Tab auf „Slow 4G“ und wiederhole Aufgabe 5. Stelle die Drosselung danach zurück.

## Checkpoint

- Aufgabe 1: Admin- und Speaker-Chunk laden direkt nach dem Start.
- Aufgabe 5: Die Konsole zeigt `[Preloading] "speakers" startet in 2 s`, rund 2 Sekunden später erscheint der Speaker-Chunk; ein Admin-Chunk erscheint nicht.
- Aufgabe 6: Der Klick auf „Speaker“ erzeugt keinen JS-Request, der Klick auf „Admin“ schon.

## Abschlusskriterien

- `DelayedPreloading` liest `route.data` und nutzt `timer` mit `switchMap`.
- `app.config.ts` aktiviert die Strategie über `withPreloading`.
- Speaker wird vorgeladen, Admin nicht.

## Erweiterung (optional)

- Lies die Verzögerung aus der Route: `data: { preload: true, delayMs: 5000 }`, Standardwert 2000.
- Lade nicht vor, wenn der Browser „Datensparmodus“ meldet: `(navigator as { connection?: { saveData?: boolean } }).connection?.saveData`.

## Fallback

- Ergebnis übernehmen: `src/app/examples/m08-advanced-routing/l02-preloading/eventhub/` und `src/app/examples/m08-advanced-routing/l02-preloading/app.config.ts` nach `workspaces/eventhub-lab/src/app/` kopieren.
- Die Kurs-App zeigt unter `/examples/m08-advanced-routing/l02-preloading` dieselben Routen, lädt dort aber nicht vor: Der Root-Router der Kurs-App nutzt `NoPreloading`.
