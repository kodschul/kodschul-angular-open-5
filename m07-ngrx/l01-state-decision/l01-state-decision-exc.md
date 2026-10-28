# Lab 7.1 – Übung: Welcher State gehört wohin?

**Dauer:** ca. 13 Minuten (8 Minuten zu zweit, 5 Minuten Vergleich im Plenum)
**Ändert die EventHub-Projektbasis?** Nein — Denkübung; das Ergebnis ist eine ausgefüllte Tabelle.

## Vorbereitung

- Kein Server nötig. Zum Vergleich am Ende: Terminal 1 `npm run api`, Terminal 2 `npm start`.
- Arbeitsdatei: `src/app/playground/state-decision.md` (neu)
- Starter: `src/app/starters/m07-l01-state-decision.md`
- Vergleich: http://localhost:4200/examples/m07-ngrx/l01-state-decision

Zur Auswahl stehen diese Orte: **Komponente**, **URL**, **Formular**, **Service mit Signals**, **Signal Store**, **NgRx Store**.
Arten: **UI**, **Formular**, **Server-Cache**, **globaler App-Zustand**, **URL**.

| # | Zustand | Art | Ort | Begründung (ein Satz) |
| - | ------- | --- | --- | --------------------- |
| 1 | Dropdown „Track-Filter“ ist geöffnet | | | |
| 2 | Suchbegriff der Session-Suche | | | |
| 3 | Eingaben im Anmeldeformular vor dem Absenden | | | |
| 4 | Eingeloggte Person | | | |
| 5 | Session-Liste vom Server | | | |
| 6 | Favoriten der Person (Herz auf der Karte, Zähler im Header, eigene Favoritenseite) | | | |
| 7 | Warenkorb mit Workshop-Tickets (Summe, Rabatt, soll Reload überleben) | | | |
| 8 | Admin: Session-Änderungen mehrerer Teams, jede Änderung soll nachvollziehbar sein | | | |

## Aufgaben

1. Kopiere `src/app/starters/m07-l01-state-decision.md` nach `src/app/playground/state-decision.md`.
2. Trage für jeden der acht Zustände die Art ein.
3. Wähle für jeden Zustand einen Ort. Nutze den Entscheidungsweg aus der Theorie.
4. Schreibe für jeden Zustand eine Begründung in einem Satz. Nenne darin, wer den Zustand liest oder was er überleben muss.
5. Markiere die zwei Zeilen, bei denen die Entscheidung am knappsten war, mit `(knapp)` und notiere die zweite Option.
6. Öffne http://localhost:4200/examples/m07-ngrx/l01-state-decision und vergleiche. Notiere bei jeder Abweichung, ob die eigene Begründung trägt.

## Checkpoint

- Alle acht Zeilen haben Art, Ort und Begründung.
- Mindestens drei verschiedene Orte kommen vor.
- Zwei Zeilen sind als `(knapp)` markiert, mit zweiter Option.

## Abschlusskriterien

- `src/app/playground/state-decision.md` enthält die ausgefüllte Tabelle.
- Jede Abweichung zur Referenz ist mit einem Satz kommentiert.

## Erweiterung

- Ergänze zwei Zustände aus dem eigenen Projekt und ordne sie ebenso ein.
- Vergleiche die Tabelle mit einer anderen Person und halte pro Zeile eine gemeinsame Antwort fest.
