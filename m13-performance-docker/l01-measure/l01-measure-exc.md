# Lab 13.1 – Übung: Performance messen mit Lighthouse und DevTools

**Dauer:** ca. 20 Minuten (Paar)
**Ändert die EventHub-Projektbasis?** Nein — gemessen wird die vorbereitete Variante `workspaces/eventhub-perf/`; Lab 13.2 behebt die Befunde.

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm run api` (Mock-API, Port 3000).
- Terminal 2 im Ordner `project/workspaces/eventhub-perf/`: `npm install` (einmalig, ca. 1 Minute).
- Arbeitsordner: `project/workspaces/eventhub-perf/` (kleine EventHub-App: Startseite mit Hero-Bild, Programm, Auslastungsdiagramm; Detailseite `/sessions/:id`).
- Chrome mit Angular DevTools; Lighthouse ist in den Chrome DevTools eingebaut.
- Das Hero-Bild `public/img/hero.png` erzeugt das Skript `scripts/generate-hero.mjs` beim ersten `npm start` oder `npm run build` lokal.

## Aufgaben

1. Erzeuge im Ordner `workspaces/eventhub-perf/` den Produktions-Build mit Statistikdatei: `npm run build:stats`. Notiere aus der Build-Ausgabe die Zeile „Initial total“ (Raw size und Estimated transfer size).
2. Starte den statischen Server mit `npm run serve:dist` und öffne http://localhost:8081 in einem Chrome-Inkognito-Fenster. Prüfe, dass das Programm mit Sessions erscheint.
3. Öffne DevTools → „Lighthouse“, wähle Mode „Navigation“, Device „Mobile“, nur Category „Performance“ und starte „Analyze page load“. Wiederhole die Messung zweimal und trage den Median von Score, FCP, LCP, TBT und CLS ins Protokoll ein.
4. Notiere aus dem Bericht das LCP-Element und die drei Hinweise mit dem größten Einfluss (Abschnitte „Diagnostics“ und „Insights“).
5. Öffne https://esbuild.github.io/analyze/, importiere `dist/eventhub-perf/browser-stats.json` und notiere die drei größten Pakete in `main-….js` mit ihrer Größe.
6. Beende den statischen Server, starte im selben Terminal `npm start` und öffne http://localhost:4300 (normales Fenster mit Angular DevTools).
7. Öffne Angular DevTools → „Profiler“ und starte die Aufnahme. Tippe langsam `angular` in das Suchfeld, warte danach 5 Sekunden und stoppe die Aufnahme. Notiere die Anzahl der Change-Detection-Durchläufe und die Dauer von `SessionList` im längsten Durchlauf.
8. Warte mit geöffneter Konsole mindestens 10 Sekunden auf der Startseite und notiere die Warnung, die nach dem automatischen Neuladen der Auslastung erscheint.
9. Lege `workspaces/eventhub-perf/messprotokoll.md` nach der Vorlage unten an und formuliere drei Befunde: Messwert, Ort im Code (Datei), vermutete Ursache, mögliche Technik aus dem Kurs.

Vorlage `messprotokoll.md`:

```markdown
# Messprotokoll EventHub-Perf

Gerät/Browser: …  ·  Lighthouse-Version: …  ·  Datum: …

| Kennzahl | Lauf 1 | Lauf 2 | Lauf 3 | Median |
| --- | --- | --- | --- | --- |
| Performance-Score | | | | |
| FCP | | | | |
| LCP | | | | |
| TBT | | | | |
| CLS | | | | |
| Initial total (raw / transfer) | | | | |

## Befunde

| Nr. | Messwert / Beobachtung | Ort im Code | Vermutete Ursache | Mögliche Technik |
| --- | --- | --- | --- | --- |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
```

## Checkpoint

- Nach Aufgabe 3: drei Lighthouse-Läufe mit Werten im Protokoll.
- Nach Aufgabe 5: ein Paket außerhalb von `@angular/*` taucht unter den drei größten auf.
- Nach Aufgabe 7: Der Profiler zeigt pro Tastendruck und pro Sekunde einen Durchlauf mit `SessionList`.

## Abschlusskriterien

- `messprotokoll.md` enthält Ausgangswerte (Median) und die Initial-Bundle-Größe.
- Drei Befunde mit Datei und Ursache: je einer zu Bild, Bundle und Template.

## Erweiterung

- Nimm im Tab „Performance“ der Chrome DevTools 5 Sekunden mit Tippen im Suchfeld auf (Produktions-Build). Öffne „Bottom-Up“ und notiere die Funktion mit der höchsten „Self Time“.
- Miss zusätzlich mit Device „Desktop“ und vergleiche, welche Kennzahlen sich am stärksten ändern.

## Fallback

- Ohne Angular DevTools: Aufgabe 7 im Performance-Panel erledigen (siehe Erweiterung), lange Aufgaben zählen.
- Ohne Internet für den esbuild Analyzer: Aufgabe 5 mit der Größenaufteilung aus der Build-Ausgabe und dem Hinweis „Reduce unused JavaScript“ aus Lighthouse lösen.
- Startet `npm install` nicht (Proxy): Trainer-Bildschirm verfolgen, Werte aus der Lösung als Beispielwerte übernehmen und nur die Befunde selbst formulieren.
