# Lab 13.2 – Übung: Optimieren und nachmessen

**Dauer:** ca. 20 Minuten (Paar)
**Ändert die EventHub-Projektbasis?** Ja — `workspaces/eventhub-perf/` wird optimiert; der optimierte Stand ist die Basis für den Container in Lab 13.3 (Referenz: `workspaces/eventhub-perf-fixed/`).

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm run api`.
- Terminal 2 im Ordner `project/workspaces/eventhub-perf/` (aus Lab 13.1, `npm install` erledigt).
- `messprotokoll.md` aus Lab 13.1 liegt im selben Ordner.
- Arbeitsdateien: `src/app/home/home.ts`, `src/app/sessions/session-list.ts`, `package.json`, `angular.json`.
- Zum Zurücksetzen der Variante: `git checkout -- .` im Ordner `workspaces/eventhub-perf/`.

## Aufgaben

1. Ändere in `package.json` das Skript `hero` auf `node scripts/generate-hero.mjs --width 1400 --height 700 --noise 0 --force` und führe `npm run hero` aus. Prüfe die Dateigröße von `public/img/hero.png`.
2. Ersetze in `src/app/home/home.ts` das `<img src="img/hero.png" …>` durch `NgOptimizedImage`: `ngSrc`, `width="1400"`, `height="700"`, `priority`, Import in `imports`.
3. Lege in `home.ts` `<app-booking-chart />` in einen `@defer`-Block mit Trigger `on viewport` und `prefetch on idle`. Ergänze `@placeholder` und `@loading` mit derselben Höhe wie das Diagramm (`.card` mit innerem Element `height: 320px`).
4. Ersetze in `src/app/sessions/session-list.ts` die Methode `relevance()` im Template: Berechne `{ session, score }` einmal in einem `computed()`, filtere darauf und lies im Template nur noch `item.score`. Mache `relevance` zu einer Funktion außerhalb der Klasse.
5. Ändere den `@for`-Block auf `track item.session.id`.
6. Gib dem Ladezustand der Liste eine Mindesthöhe (z. B. `min-height: 1200px`), damit der Inhalt darunter beim Laden nicht springt.
7. Setze in `angular.json` die Budgets der Konfiguration `production`: `initial` 350 kB Warnung / 500 kB Fehler, `anyScript` 250 kB / 400 kB, `anyComponentStyle` 2 kB / 4 kB.
8. Führe `npm run build` aus. Notiere „Initial total“ und prüfe, dass `booking-chart` unter „Lazy chunk files“ steht.
9. Starte `npm run serve:dist`, miss dreimal mit Lighthouse (Mobil, Inkognito) und ergänze `messprotokoll.md` um eine Vorher/Nachher-Tabelle (Score, FCP, LCP, TBT, CLS, Initial total, übertragene Daten).
10. Starte `npm start`, wiederhole die Profiler-Aufnahme aus Lab 13.1 (Tippen im Suchfeld) und notiere die Dauer von `SessionList`. Prüfe, dass `NG0956` nach 10 Sekunden nicht mehr erscheint.

Vorlage für die Tabelle:

```markdown
## Vorher/Nachher

| Kennzahl | Vorher (Median) | Nachher (Median) | Maßnahme |
| --- | --- | --- | --- |
| Performance-Score | | | |
| LCP | | | |
| TBT | | | |
| CLS | | | |
| Initial total (raw) | | | |
| Übertragene Daten | | | |
```

## Checkpoint

- Nach Aufgabe 2: Die Konsole von `npm start` zeigt kein `NG0913` mehr, das `<img>` im DOM trägt `fetchpriority="high"`.
- Nach Aufgabe 3: Im Network-Tab lädt ein zusätzlicher `chunk-….js`, sobald das Diagramm in Sicht kommt.
- Nach Aufgabe 8: Initial total liegt unter 350 kB, die Budgets melden keine Warnung.

## Abschlusskriterien

- Die drei Befunde aus Lab 13.1 sind behoben, Budgets sind gesetzt.
- `messprotokoll.md` enthält die Vorher/Nachher-Tabelle mit Messwerten und je einer Maßnahme pro Zeile.

## Erweiterung

- Lade die Detailseite per `loadComponent` in `src/app/app.routes.ts` (Lab 8.1) und prüfe den neuen Lazy-Chunk `session-detail`.
- Registriere in `src/app/stats/booking-chart.ts` statt `registerables` nur `BarController`, `BarElement`, `CategoryScale`, `LinearScale`, `Legend` und `Tooltip`. Vergleiche die Größe des Chunks `booking-chart`.
- Senke das `initial`-Budget testweise auf `maximumError: "200kB"` und beobachte, wie der Build abbricht. Stelle den Wert danach zurück.

## Fallback

Klappt eine Änderung nicht rechtzeitig, die betroffene Datei aus `workspaces/eventhub-perf-fixed/src/app/…` übernehmen und mit dem Messen weitermachen. Beide Apps lassen sich parallel ausliefern: langsam auf Port 8081, optimiert mit `npm run serve:dist` in `eventhub-perf-fixed/` auf Port 8082.
