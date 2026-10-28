# Lab 3.1 – Übung: Control Flow Syntax

**Dauer:** ca. 16 Minuten
**Ändert die EventHub-Projektbasis?** Ja — die Session-Liste mit Control Flow ist Ausgangspunkt für Lab 3.2 und 3.3.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api` (Mock-API auf Port 3000).
- Terminal 2 im Ordner `output/project/`: `npm start` (App auf Port 4200).
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m03-l01-control-flow.ts`
- Browser: http://localhost:4200/playground

## Aufgaben

1. Kopiere den Inhalt des Starters nach `src/app/playground/playground.ts` und prüfe im Browser: Liste, Suche und Sortier-Button funktionieren.
2. Ersetze das äußere `*ngIf="sessions$ | async as sessions; else loading"` durch `@if (sessions$ | async; as sessions) { … } @else { … }` und lösche das `<ng-template #loading>`.
3. Lege mit `@let visible = …` die gefilterte, sortierte Liste einmal an und nutze `visible` für die Anzahl-Zeile.
4. Ersetze `*ngFor` und das innere `*ngIf … else empty` durch einen `@for` über `visible` mit `track session.id` und einem `@empty`-Zweig mit dem Hinweistext.
5. Ersetze `ngSwitch` durch `@switch (session.level)` mit drei Zweigen: `Einsteiger` → `badge-ok`, `Fortgeschritten` → `badge-warn`, `@default` → `badge-error`.
6. Entferne `NgIf`, `NgFor`, `NgSwitch`, `NgSwitchCase`, `NgSwitchDefault` aus `imports` und aus der Import-Zeile; die App baut ohne Fehler und ohne Warnung im Terminal.
7. Teste `@empty`: Suche nach `xyz`.
8. Teste `track`: Schreibe in das Notizfeld der ersten Session „Merken“, klicke auf „Sortierung“ und beobachte, wohin die Notiz wandert. Ändere `track session.id` in `track $index`, wiederhole den Test und stelle danach `track session.id` wieder her.

## Checkpoint

- Das Template enthält kein `*ngIf`, `*ngFor`, `ngSwitch` und kein `<ng-template>` mehr.
- Die Suche nach `xyz` zeigt „Keine Session passt zu „xyz““ und „0 von 12 Sessions“.
- Mit `track session.id` wandert die Notiz mit ihrer Session ans Listenende; mit `track $index` bleibt sie oben stehen, bei einer anderen Session.

## Abschlusskriterien

- `src/app/playground/playground.ts` nutzt `@if`, `@for` mit `track session.id`, `@empty`, `@switch` und `@let`.
- `imports` enthält nur noch `AsyncPipe`, `DatePipe` und `SessionSortPipe`.

## Erweiterung

- Kopiere den Starter erneut in den Playground und führe `npx ng generate @angular/core:control-flow --path src/app/playground` aus (Formatieren: ja). Vergleiche das Ergebnis mit der eigenen Lösung: Welchen `track`-Ausdruck wählt das Schematic, wo fehlen `@empty` und `@let`?
- Zeige mit `@for (…; let i = $index, last = $last)` vor jeder Session ihre Nummer an und unter der letzten Session den Text „Ende der Liste“.

## Fallback

Läuft die Mock-API nicht, bleibt die Seite bei „Lade Sessions …“. Prüfe dann Terminal 1 (`npm run api`) und http://localhost:3000/sessions im Browser.
