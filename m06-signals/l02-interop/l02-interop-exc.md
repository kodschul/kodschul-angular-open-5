# Lab 6.2 – Übung: Suche und Detail ohne subscribe

**Dauer:** ca. 16 Minuten
**Ändert die EventHub-Projektbasis?** Ja — Detail per `httpResource` und Suche per `toSignal` sind das Muster für die Labs ab m07.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api`
- Terminal 2 im Ordner `output/project/`: `npm start`
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m06-l02-interop.ts`
- Browser: http://localhost:4200/playground, DevTools mit Tab „Network“

Der Starter enthält zwei Komponenten: `SessionDetail` (Detail mit `@Input`-Setter, der die ID in das Signal `sessionId` schreibt) und `Playground` (Suchfeld, Level-Auswahl, Liste, rechts das Detail). Die Templates sind fertig. Die Suchfunktion `createSessionSearch` kommt aus dem Beispiel von Lab 5.2 (`src/app/examples/m05-rxjs/l02-operators/session-search.ts`).

## Aufgaben

1. Kopiere den Starter nach `src/app/playground/playground.ts` und öffne `/playground`. Öffne danach `/playground?id=3` und prüfe, was rechts erscheint.
2. Ersetze in `SessionDetail` die Funktion in `httpResource` so, dass sie aus `sessionId()` die URL `${API_URL}/sessions/<id>` bildet und ohne ID `undefined` liefert.
3. Prüfe Lade- und Fehlerzustand: Öffne `/playground?id=3`, dann `/playground?id=999`. Klicke bei 999 „Erneut versuchen“ und beobachte den Network-Tab.
4. Ersetze in `Playground` den Platzhalter `result`: Die Signals `term` und `level` sollen die Suche `createSessionSearch` aus Lab 5.2 speisen (Anfragen über `this.api.getSessions`), und das Template liest das Ergebnis als Signal. Vor dem ersten Ergebnis ist der Wert `null`.
5. Tippe `test` in das Suchfeld, wähle eine Session und prüfe, dass URL (`?id=…`) und Detail wechseln. Klicke schnell nacheinander auf zwei Sessions und prüfe im Network-Tab, ob eine Anfrage abgebrochen wird.
6. Suche in `playground.ts` nach `subscribe(` und notiere die Anzahl der Treffer.

## Checkpoint

- Nach Aufgabe 1: Bei `?id=3` steht rechts „Noch nichts geladen.“, links „Suche läuft …“.
- Nach Aufgabe 3: Bei `id=3` erscheint „RxJS-Operatoren, die wirklich zählen“; bei `id=999` „Fehler 404: Session 999 nicht geladen.“
- Nach Aufgabe 4: Die Liste zeigt beim Laden alle zwölf Sessions, Tippen filtert nach 300 ms Pause.

## Abschlusskriterien

- Suche und Detail funktionieren ohne ein einziges `subscribe()` im Playground.
- Detail zeigt Lade-, Fehler- und Erfolgszustand.
- Ein Wechsel der Session lädt automatisch neu, ohne eigenen Code für den Wechsel.

## Erweiterung

- Ersetze `httpResource` testweise durch `rxResource` mit `params: () => this.sessionId()` und `stream: ({ params: id }) => this.api.getSession(id)` (Service per `inject(SessionApi)`). Entferne dafür `session.statusCode()` aus dem Template und vergleiche das Verhalten.
- Lade das Detail mit `_delay=1500` an der URL und prüfe die Ladeanzeige.

## Fallback

Ohne laufende Mock-API zeigt das Detail „Fehler 0: …“ (Status 0 = keine Verbindung) und die Suche „Suche fehlgeschlagen“. Die Struktur des Codes lässt sich trotzdem prüfen; das fertige Beispiel liegt unter `/examples/m06-signals/l02-interop` (braucht ebenfalls die Mock-API).
