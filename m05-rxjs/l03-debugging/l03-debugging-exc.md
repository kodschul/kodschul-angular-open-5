# Lab 5.3 – Übung: Speicherleck finden und beheben

**Dauer:** ca. 13 Minuten
**Ändert die EventHub-Projektbasis?** Ja — die Aufräum-Muster gelten ab hier für jedes `subscribe()` im Kurs.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm start` (die Mock-API wird in diesem Lab nicht gebraucht)
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m05-l03-debugging.ts`
- Browser: http://localhost:4200/playground mit geöffneter Konsole; in den Konsolen-Einstellungen „Preserve log“ aktivieren

Die Komponente im Starter speichert jede Sekunde einen „Entwurf“ (simuliert per Log). Die Hilfsfunktion `debug(name)` ist im Starter bereits enthalten. Die Route wird über den Link „Beispiele“ in der Kopfzeile verlassen und über „Playground“ wieder geöffnet.

## Aufgaben

1. Kopiere den Starter nach `src/app/playground/playground.ts`, öffne `/playground` und beobachte die Konsole fünf Sekunden lang.
2. Wechsle über „Beispiele“ zur Startseite und beobachte die Konsole weitere fünf Sekunden. Notiere, was passiert.
3. Öffne „Playground“ erneut und notiere, wie die Ausgabe jetzt aussieht.
4. Weise das Leck mit Zahlen nach: Setze `debug('entwurf')` in die Kette vor `subscribe()`, lade die Seite neu (F5) und wiederhole Aufgabe 2 und 3. Notiere den Wert hinter „aktiv:“ nach dem zweiten Öffnen.
5. Beschreibe das Fehlerbild als Marble-Diagramm in einem Kommentar über der Klasse (Route, erwartete und beobachtete Werte).
6. Behebe das Leck mit `takeUntilDestroyed`: Injiziere `DestroyRef` als Feld und übergib es in `ngOnInit`. Lade neu und prüfe mit Aufgabe 2 und 3.
7. Zeige zusätzlich den aktuellen Zähler im Template an, ohne im Code zu abonnieren: Feld `tick$` mit `interval(1000)` und `{{ tick$ | async }}`.

## Checkpoint

- Nach Aufgabe 2: Die Zeilen „Entwurf gespeichert“ laufen auf der Startseite weiter.
- Nach Aufgabe 4: Nach dem zweiten Öffnen steht „aktiv: 2“, die Zahlen erscheinen doppelt.
- Nach Aufgabe 6: Beim Verlassen erscheint „[entwurf] beendet – aktiv: 0“, danach keine Zeilen mehr.

## Abschlusskriterien

- Das Log zeigt nach dem Routenwechsel keine Werte mehr.
- Nach beliebig häufigem Öffnen und Verlassen ist höchstens ein Abo aktiv.
- Das Marble-Diagramm beschreibt Erwartung und Beobachtung.

## Erweiterung

- Ersetze den `DestroyRef`-Weg durch `takeUntilDestroyed()` ohne Argument und verschiebe das Abo dafür in den Konstruktor. Teste danach, was passiert, wenn `takeUntilDestroyed()` ohne Argument in `ngOnInit` steht.
- Öffne `/examples/m05-rxjs/l03-debugging`, wechsle zwischen den drei Kind-Routen und vergleiche die Logs von „Ticker mit Leck“ und „Ticker aufgeräumt“.
