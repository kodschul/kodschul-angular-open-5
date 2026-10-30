# Lab 5.1 – Übung: Marble-Diagramme zeichnen und prüfen

**Dauer:** ca. 17 Minuten (Paararbeit)
**Ändert die EventHub-Projektbasis?** Nein — reine Übung im Playground.

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm start` (die Mock-API wird in diesem Lab nicht gebraucht).
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m05-l01-marbles.ts`
- Browser: http://localhost:4200/playground mit geöffneter DevTools-Konsole

Die vier Ketten im Starter (1 Zeichen = 100 ms):

| Nr. | Eingabe | Operator | Werte |
| --- | --- | --- | --- |
| 1 | `-1-2-3|` | `map(x => x * 10)` | Zahlen 1, 2, 3 |
| 2 | `-1-2-3-4-5|` | `filter(x => x % 2 === 0)` | Zahlen 1 bis 5 |
| 3 | `abc----de------|` | `debounceTime(300)` | a=`a`, b=`an`, c=`ang`, d=`angu`, e=`angul` (Tippen mit Pause) |
| 4 | `-a-b-c-d|` | `take(2)` | Buchstaben |

## Aufgaben

1. Kopiere den Inhalt des Starters nach `src/app/playground/playground.ts` und öffne `/playground`.
2. Zeichne für jede der vier Ketten das Ausgabe-Diagramm, ohne die App zu starten: auf Papier oder im Kommentarblock oben im Playground. Gleiche Länge wie die Eingabe, ein Zeichen pro Frame, Ende mit `|`, gleichzeitige Ereignisse in Klammern.
3. Notiere zu Kette 3, zu welchen Frames `debounceTime` sendet und warum.
4. Hänge an jede Kette hinter den Operator ein `tap({ next, complete })`, das Kettenname, `frameSeit(start)` und den Wert bzw. `|` loggt.
5. Ergänze bei Kette 3 ein zweites `tap` vor `debounceTime`, damit die Eingabe ebenfalls im Log steht.
6. Klicke auf „Ketten starten“ und vergleiche das Log Frame für Frame mit den gezeichneten Diagrammen. Korrigiere abweichende Diagramme und notiere die Ursache des Irrtums in einem Satz.
7. Entferne bei Kette 4 testweise das `.subscribe()` und starte erneut. Notiere, was im Log fehlt und warum.

## Checkpoint

- Vier Ausgabe-Diagramme stehen auf Papier oder im Kommentar.
- Das Log enthält für jede Kette Werte mit Frame-Nummer und eine Zeile mit `|`.
- Kette 3 zeigt im Log fünf Eingabewerte und weniger Ausgabewerte.

## Abschlusskriterien

- Alle vier Diagramme stimmen mit dem Log überein (Abweichung höchstens ein Frame durch Timer-Schwankung).
- Für jede Korrektur ist die Ursache notiert.
- Die Beobachtung aus Aufgabe 7 ist in einem Satz erklärt.

## Erweiterung

- Ändere Kette 3 auf `abc----de|` (Quelle endet früher) und sage das Diagramm voraus, bevor das Log es zeigt.
- Prüfe eine Kette auf [rxmarbles.com](https://rxmarbles.com/) nach (Operator `debounceTime` oder `take`).
