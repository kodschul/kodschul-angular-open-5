# Lab 2.1 – Übung: Standalone statt NgModule

**Dauer:** ca. 16 Minuten
**Ändert die EventHub-Projektbasis?** Nein — die Arbeit findet nur im Playground statt.

## Vorbereitung

- Terminal 1: `npm run api`, Terminal 2: `npm start`.
- Arbeitsdatei: `src/app/playground/playground.ts` und Ordner `src/app/playground/m02-l01-standalone/`
- Starter: `src/app/starters/m02-l01-standalone.ts` und Ordner `src/app/starters/m02-l01-standalone/`
- URL: http://localhost:4200/playground

Starter kopieren (im Ordner `project/`):

```bash
cp src/app/starters/m02-l01-standalone.ts src/app/playground/playground.ts
cp -r src/app/starters/m02-l01-standalone src/app/playground/
```

Der Ordner enthält `shared.module.ts` mit drei deklarierten Bausteinen (`LevelBadge`, `DurationPipe`, `SpeakerChip`) und `session-summary.ts`, eine zweite Komponente, die das Modul ebenfalls importiert.

## Aufgaben

1. Öffne `/playground` und prüfe: Karten mit Dauer, Level-Badge und Speaker, darüber „Längste Session“.
2. Notiere, welche Bausteine `Playground` und `SessionSummary` über `SharedModule` bekommen, und welche davon sie wirklich verwenden.
3. Mache `LevelBadge` (`level-badge.ts`) standalone: `standalone: false` entfernen, die Abhängigkeit des Templates selbst importieren.
4. Mache `DurationPipe` (`duration.pipe.ts`) standalone.
5. Entferne beide aus `declarations` und `exports` von `SharedModule`. `SpeakerChip` bleibt im Modul.
6. Stelle `SessionSummary` so um, dass sie kein `SharedModule` mehr importiert, sondern nur, was ihr Template braucht.
7. Importiere `LevelBadge` und `DurationPipe` in `Playground` direkt. `SharedModule` bleibt dort für `SpeakerChip` (Mischbetrieb).
8. Lies nach jedem Schritt die Meldungen in Terminal 2 und behebe sie, bis der Build fehlerfrei ist.

## Checkpoint

- Nach Aufgabe 3 meldet der Build `NG6008` in `shared.module.ts`.
- Nach Aufgabe 7: Build ohne Fehler, `/playground` sieht aus wie in Aufgabe 1.
- `session-summary.ts` enthält kein `SharedModule` mehr.

## Abschlusskriterien

- `LevelBadge` und `DurationPipe` haben kein `standalone: false` und sind in keinem `declarations`-Array.
- `SharedModule` deklariert und exportiert nur noch `SpeakerChip` (und `CommonModule`).
- Beide Verwendungsstellen (`Playground`, `SessionSummary`) importieren Badge und Pipe direkt.

## Erweiterung

- Mache auch `SpeakerChip` standalone, entferne `SharedModule` aus `Playground` und lösche die Datei. Prüfe, welche Imports danach in `Playground` fehlen.
- Lege in `m02-l01-standalone/session-ui.ts` ein Array `export const SESSION_UI = [LevelBadge, DurationPipe] as const;` an und importiere es in `Playground` per `imports: [SESSION_UI, …]`.

## Fallback

Läuft der Build nicht mehr: `src/app/examples/m02-standalone/l01-standalone/` enthält den Zielzustand, `/examples/m02-standalone/l01-standalone` zeigt ihn.
