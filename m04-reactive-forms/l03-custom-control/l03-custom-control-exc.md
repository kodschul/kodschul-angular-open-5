# Lab 4.3 – Übung: Eigenes Formular-Control mit ControlValueAccessor

**Dauer:** ca. 20 Minuten
**Ändert die EventHub-Projektbasis?** Ja — das Anmeldeformular nutzt den `TicketCounter` statt eines Zahlenfelds.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api`.
- Terminal 2 im Ordner `output/project/`: `npm start`.
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m04-l03-custom-control.ts` (Anmeldeformular aus Lab 4.2 mit den Validatoren aus `src/app/examples/m04-reactive-forms/l02-validators/registration-validators.ts`, dazu ein `TicketCounter` ohne Formular-Anbindung)
- Browser: http://localhost:4200/playground

## Aufgaben

1. Kopiere den Inhalt des Starters nach `src/app/playground/playground.ts`. Nimm `TicketCounter` in `imports` der Playground-Komponente auf und ersetze das Zahlenfeld (Kommentar `TODO Aufgabe 1`) durch `<app-ticket-counter formControlName="tickets" />`. Lies die Fehlermeldung in der Konsole; der Zähler bleibt im Template, Aufgabe 2 behebt den Fehler.
2. Lass `TicketCounter` das Interface `ControlValueAccessor` implementieren: zunächst `writeValue`, `registerOnChange` und `registerOnTouched` mit leerem Rumpf, damit der Compiler zufrieden ist. Melde die Komponente mit einem Provider für `NG_VALUE_ACCESSOR` an (`useExisting`, `forwardRef`, `multi: true`). Die Fehlermeldung aus Aufgabe 1 verschwindet.
3. Implementiere `writeValue(value)`: `value` übernehmen (bei `null` den Wert von `min`) und die Ansicht mit `ChangeDetectorRef.markForCheck()` zur Prüfung vormerken.
4. Implementiere `registerOnChange` und `registerOnTouched`: beide Funktionen in Feldern speichern (Startwert jeweils eine leere Funktion). Rufe in `change()` nach dem Setzen des Werts beide auf.
5. Rufe `onTouched` zusätzlich beim Verlassen des Bausteins auf (`host`-Event `focusout`).
6. Ergänze am Zähler `[max]="5"` und entferne am Label `Tickets` das Attribut `for="tickets"` (es gibt kein `<input id="tickets">` mehr).
7. Implementiere `setDisabledState(isDisabled)`: Feld `disabled` setzen und `markForCheck()` aufrufen.
8. Teste mit den Buttons unter dem Zähler: „Auf 3 setzen“, „Tickets sperren“, „Tickets freigeben“, „Zurücksetzen“. Beobachte die Statuszeile „Wert … · berührt … · gesperrt …“.
9. Entferne testweise `this.cdr.markForCheck()` aus `writeValue`. Lade die Seite neu, klicke direkt „Auf 3 setzen“ (ohne vorher in den Zähler zu klicken) und vergleiche Zähler und Statuszeile. Klicke danach einmal „+“. Stelle die Zeile wieder her.
10. Sende eine Anmeldung mit 3 Tickets und gesperrtem Ticket-Feld ab.

## Checkpoint

- Nach Aufgabe 3: „Auf 3 setzen“ zeigt im Zähler 3.
- Nach Aufgabe 5: Ein Klick auf „+“ ändert die Statuszeile auf „Wert 2 · berührt · frei“.
- Nach Aufgabe 7: „Tickets sperren“ graut beide Buttons aus; „Zurücksetzen“ stellt den Zähler auf 1 und die Statuszeile auf „unberührt“.

## Abschlusskriterien

- `TicketCounter` funktioniert mit `formControlName` ohne zusätzliche `@Input`/`@Output`-Verdrahtung im Formular.
- Wert, `touched`, `disabled` und `reset()` funktionieren; die Anmeldung enthält `tickets: 3`, auch wenn das Feld gesperrt ist.

## Erweiterung

- Lass `TicketCounter` zusätzlich `Validator` implementieren (Provider `NG_VALIDATORS`), sodass Werte außerhalb von `min`–`max` den Fehler `ticketRange` liefern. Entferne danach `Validators.min/max` am Feld `tickets` und teste mit einem Button, der `setValue(9)` aufruft.
- Ermögliche die Bedienung per Pfeiltasten: Pfeil hoch/runter auf dem Baustein ändert den Wert.

## Fallback

Ohne Mock-API bleiben Workshop-Auswahl und Absenden ohne Wirkung; alle Aufgaben bis 9 funktionieren trotzdem.
