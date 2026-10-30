# Lab 4.2 – Übung: Eigene Validatoren: synchron, asynchron, feldübergreifend

**Dauer:** ca. 16 Minuten
**Ändert die EventHub-Projektbasis?** Ja — die Validatoren aus diesem Lab nutzt Lab 4.3 weiter.

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm run api`.
- Terminal 2 im Ordner `project/`: `npm start`.
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m04-l02-validators.ts` (typisiertes Formular aus Lab 4.1, Gerüste für `companyEmail` und `workshopsDoNotOverlap`, fertige Hilfsfunktion `overlaps`)
- Browser: http://localhost:4200/playground, DevTools mit Tab „Network“ (für die Erweiterung)

## Aufgaben

### Teil a: Firmen-E-Mail

1. Kopiere den Inhalt des Starters nach `src/app/playground/playground.ts`. Implementiere `companyEmail`: Domain hinter dem `@` ermitteln (klein geschrieben), bei leerer Domain `null`, bei einer Domain aus `blocked` den Fehler `{ companyEmail: { domain } }`. Entferne das `console.log`.
2. Hänge `companyEmail()` an das Feld `email` an (zusätzlich zu `required` und `email`).
3. Ersetze den Kommentar `TODO Aufgabe 3` durch Fehlermeldungen, die erst nach dem Verlassen des Felds erscheinen: „E-Mail fehlt.“, „Keine gültige E-Mail-Adresse.“ und „Bitte eine Firmenadresse verwenden (… ist ein Freemail-Anbieter).“ mit der Domain aus dem Fehlerobjekt.

### Teil b: Workshops überschneiden sich nicht

4. Implementiere `workshopsDoNotOverlap`: alle gewählten Workshops aus `group.get('workshops')` lesen, `null` herausfiltern, jedes Paar mit `overlaps` prüfen und beim ersten Treffer `{ workshopOverlap: { first, second } }` mit beiden Titeln liefern.
5. Hänge den Validator als Gruppen-Validator an `this.fb.group(...)` an und ersetze den Kommentar `TODO Aufgabe 5` durch die Meldung „„…“ und „…“ finden gleichzeitig statt.“.
6. Teste: Wähle „State Management mit NgRx“ und „Login richtig gemacht“ (beide Do 09:00), dann „State Management mit NgRx“ und „Testen ohne Tränen“ (Do 14:00).

## Checkpoint

- `max@gmail.com` zeigt nach dem Verlassen des Felds die Freemail-Meldung mit `gmail.com`; `max@beispiel-firma.de` zeigt keine Meldung.
- Zwei Workshops um 09:00 zeigen die Überschneidungsmeldung, „Status“ steht auf `INVALID`; 09:00 plus 14:00 ist gültig.

## Abschlusskriterien

- Formular mit zwei eigenen Regeln und verständlichen Meldungen; Absenden ist nur ohne Fehler möglich.
- Beide Validatoren liefern bei leeren Werten `null`.

## Erweiterung

7. Schreibe einen asynchronen Validator `emailNotRegistered(http: HttpClient): AsyncValidatorFn`, der `GET /registrations?email=…` aufruft und mit `map` bei mindestens einem Treffer `{ alreadyRegistered: true }` liefert, sonst `null`.
8. Stelle das Feld `email` auf die Objekt-Schreibweise `this.fb.control('', { validators: [...], asyncValidators: [...], updateOn: 'blur' })` um.
9. Zeige „Prüfe, ob die E-Mail schon angemeldet ist …“, solange der Status `PENDING` ist, und „Diese E-Mail ist bereits angemeldet.“ beim Fehler. Lies dafür `email.pending` und den Fehlerschlüssel direkt im Template.
10. Teste mit `kim.berger@beispiel-firma.de` (in den Mock-Daten angemeldet) und mit einer neuen Firmenadresse. Beobachte im Network-Tab, wie viele Anfragen an `/registrations` gehen.

## Fallback

Ohne Mock-API bleibt die Workshop-Auswahl leer; Teil b lässt sich dann nicht im Browser testen. Teil a funktioniert ohne API. In der Erweiterung bricht der asynchrone Validator ohne API mit einem Fehler in der Konsole ab.
