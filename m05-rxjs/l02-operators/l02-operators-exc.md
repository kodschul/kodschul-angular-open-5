# Lab 5.2 – Übung: Live-Suche ohne Race Conditions

**Dauer:** ca. 20 Minuten
**Ändert die EventHub-Projektbasis?** Ja — die Suchfunktion `createSessionSearch` wird in Lab 6.2 und Lab 10.3 wiederverwendet (dort aus dem Beispielordner).

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api`
- Terminal 2 im Ordner `output/project/`: `npm start`
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m05-l02-operators.ts`
- Browser: http://localhost:4200/playground, DevTools mit Tab „Console“ und Tab „Network“ (Filter `sessions`)

Der Starter enthält die fertige Komponente (Suchfeld, Level-Auswahl, Checkbox für den API-Fehler, Anzeige per `async`-Pipe) und die Anfragefunktion `search()`, die immer `_randomDelay=1` mitschickt. Zu schreiben ist nur der Körper von `createSessionSearch`.

## Aufgaben

1. Kopiere den Inhalt des Starters nach `src/app/playground/playground.ts` und öffne `/playground`. Die Seite zeigt „Ergebnis für »«“ und keine Treffer.
2. Implementiere `createSessionSearch`: Jede Änderung von Suchbegriff oder Level löst `search(q, level)` mit den aktuellen Werten beider Eingänge aus. Alle Anfragen laufen parallel weiter (bewusst das Fehlerbild mit `mergeMap`). Jede Antwort erscheint als `SessionSearchResult` mit `error: null`.
3. Reproduziere die Race Condition: Tippe zügig `angular` in das Suchfeld und beobachte Konsole, Liste und Badge. Wiederhole es drei- bis viermal mit unterschiedlichem Tempo. Notiere einen Fall, in dem „Ergebnis für“ nicht zum Suchfeld passt.
4. Ersetze `mergeMap` durch `switchMap` und wiederhole Aufgabe 3. Prüfe im Network-Tab, welche Anfragen als abgebrochen (`canceled`) markiert sind.
5. Bereite `term$` vor dem `combineLatest` vor: `map` mit `trim()`, `debounceTime(300)`, `distinctUntilChanged()`. Zähle im Network-Tab die Anfragen beim Tippen von `angular`.
6. Fange Fehler an der inneren Anfrage ab: `retry(1)`, dann `catchError`, das ein Ergebnis mit leerer Liste und `error: 'Suche fehlgeschlagen'` liefert. Aktiviere „API-Fehler simulieren“, ändere den Suchbegriff und prüfe Anzeige und Network-Tab. Deaktiviere den Schalter, ändere den Begriff erneut und prüfe, dass die Suche wieder Treffer liefert.
7. Wähle im Level-Filter „Experte“ und prüfe, dass sich die Liste ohne neue Eingabe im Suchfeld aktualisiert.

## Checkpoint

- Nach Aufgabe 3: Mindestens einmal zeigt die Liste Treffer für einen älteren Begriff, das Badge „passt nicht zur Eingabe“ bleibt stehen.
- Nach Aufgabe 4: Das Badge bleibt nach Ende des Tippens nie stehen; der Network-Tab zeigt abgebrochene Anfragen.
- Nach Aufgabe 5: Für `angular` in einem Zug gibt es eine Anfrage statt sieben.
- Nach Aufgabe 6: Bei aktivem Schalter zeigt der Network-Tab pro Begriff zwei Anfragen mit Status 500 und die Seite „Suche fehlgeschlagen“.

## Abschlusskriterien

- Die Suche zeigt immer das Ergebnis des letzten Suchbegriffs.
- Ein API-Fehler erzeugt eine Meldung, danach funktioniert die Suche ohne Neuladen weiter.
- Suchbegriff und Level wirken zusammen.

## Erweiterung

- Verschiebe `catchError` testweise hinter `switchMap` (äußerer Strom), löse einen Fehler aus und prüfe, ob danach noch gesucht wird. Notiere den Unterschied in einem Satz und stelle den Code wieder her.
- Ersetze `switchMap` testweise durch `concatMap` und durch `exhaustMap`. Beschreibe für beide in einem Satz, was beim schnellen Tippen passiert.

## Fallback

Läuft die Mock-API nicht, zeigt die Seite in Aufgabe 6 dauerhaft „Suche fehlgeschlagen“ und der Network-Tab `net::ERR_CONNECTION_REFUSED`. Zum Vergleich ohne eigenen Code dienen `/examples/m05-rxjs/l02-operators/ohne` (mit `mergeMap` und ohne `debounceTime`, wie nach Aufgabe 2) und `/examples/m05-rxjs/l02-operators` (mit `switchMap`); beide brauchen ebenfalls die Mock-API.
