# Lab 4.1 – Übung: Typed Reactive Forms

**Dauer:** ca. 13 Minuten
**Ändert die EventHub-Projektbasis?** Ja — das typisierte Anmeldeformular ist Ausgangspunkt für Lab 4.2 und 4.3.

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm run api`.
- Terminal 2 im Ordner `project/`: `npm start`.
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m04-l01-typed-forms.ts` (Formular mit `new FormGroup`, Anzeige, `send()` für den POST sind fertig; der Workshop-Bereich im Template ist vorbereitet und auskommentiert)
- Browser: http://localhost:4200/playground, DevTools mit Tab „Console“

## Aufgaben

1. Kopiere den Inhalt des Starters nach `src/app/playground/playground.ts`. Fahre im Editor mit der Maus über `value` in `submit()` und notiere den angezeigten Typ.
2. Fülle das Formular aus, klicke „Zurücksetzen“ und notiere die Werte unter „Formularwert“.
3. Ersetze `new FormGroup`/`new FormControl` durch `inject(NonNullableFormBuilder)` und `this.fb.group({...})` mit denselben Startwerten und Validatoren. Wiederhole die Schritte 1 und 2 und vergleiche.
4. Ergänze im Formular ein Feld `workshops` als `FormArray<FormControl<Session | null>>`, das leer startet. Schreibe `addWorkshop()` (neues Control mit Startwert `null` und `Validators.required`) und `removeWorkshop(index)`.
5. Entferne im Template die Kommentarzeichen um den Block `TODO Aufgabe 5` (Zeile mit `<!-- TODO Aufgabe 5` und Zeile `Ende TODO Aufgabe 5 -->`). Verbinde den Block mit dem Formular: `formArrayName="workshops"` am umschließenden `<div>`, `[formControlName]="i"` am `<select>`. Nimm `DatePipe` in `imports` auf.
6. Ändere `submit()`: bei ungültigem Formular `markAllAsTouched()` und abbrechen; sonst mit `getRawValue()` ein Objekt vom Typ `Registration` bauen (`workshopIds` aus den gewählten Workshops), in der Konsole ausgeben und mit `send(...)` abschicken.
7. Ändere die Anzeige unter „Formularwert“ auf `form.getRawValue()` und teste: zwei Workshops hinzufügen, einen entfernen, absenden.

## Checkpoint

- Nach Schritt 3: `value` hat Felder vom Typ `string`/`number` ohne `null`; nach „Zurücksetzen“ steht `tickets` wieder auf `1`.
- Nach Schritt 5: „Workshop hinzufügen“ erzeugt ein Auswahlfeld mit vier Workshops; „Entfernen“ löscht genau dieses Feld.
- Nach Schritt 7: Die Konsole zeigt `Anmeldung { name: …, workshopIds: [5] }`, darunter erscheint „Angemeldet: Nr. …“.

## Abschlusskriterien

- Kein `new FormControl`/`new FormGroup` mehr in der Arbeitsdatei, der Compiler meldet keinen Fehler.
- `submit()` erzeugt ein Objekt vom Typ `Registration` ohne Typumwandlung (`as`).

## Erweiterung

- Deaktiviere im Konstruktor oder per Button das Feld `company` (`form.controls.company.disable()`) und vergleiche `form.value` mit `form.getRawValue()`.
- Verhindere, dass derselbe Workshop zweimal gewählt wird: Blende in jedem Auswahlfeld die Workshops aus, die in einem anderen Feld schon gewählt sind.

## Fallback

Läuft die Mock-API nicht, bleibt die Workshop-Auswahl leer und der POST scheitert (Fehler in der Konsole). Die Typ-Aufgaben 1–3 funktionieren trotzdem.
