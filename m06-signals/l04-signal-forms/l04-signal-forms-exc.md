# Lab 6.4 – Übung: Login-Formular mit Signal Forms

**Dauer:** ca. 13 Minuten
**Ändert die EventHub-Projektbasis?** Ja — das Login-Formular wird in Lab 9.2 an `POST /auth/login` angeschlossen (dort als fertige Komponente `LoginFormComponent` aus dem Beispielordner).

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm start` (die Mock-API wird erst in Lab 9.2 gebraucht)
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m06-l04-signal-forms.ts`
- Browser: http://localhost:4200/playground

Der Starter enthält das Modell `model` (E-Mail, Passwort), ein Formular ohne Regeln (`form(this.model)`), das HTML-Gerüst mit beiden Feldern und eine Ausgabe des Modells als JSON. Beide Felder sind bereits per `[formField]` an `loginForm.email` bzw. `loginForm.password` gebunden (`FormField` steht in `imports`). Die übrigen Imports aus `@angular/forms/signals` stehen ebenfalls in der Datei.

## Aufgaben

1. Kopiere den Starter nach `src/app/playground/playground.ts` und öffne `/playground`. Tippe in beide Felder und beobachte die Modell-Ausgabe.
2. Übergib `form()` als zweites Argument eine Schema-Funktion: E-Mail Pflicht und gültige Adresse, Passwort Pflicht und mindestens 6 Zeichen, jeweils mit deutscher Meldung per `message`.
3. Zeige unter jedem Feld dessen Fehlermeldungen an, sobald das Feld berührt wurde (`touched()`, `errors()`, `error.message`). Zeige neben dem Button „Formular gültig“ oder „Formular ungültig“ (`loginForm().valid()`).
4. Ergänze `FormRoot` in `imports`, binde `<form [formRoot]="loginForm">` und übergib `form()` als drittes Argument Optionen mit `submission.action`, die den Formularwert in `lastSubmit` schreibt. Zeige `lastSubmit()` unter dem Formular an.
5. Prüfe drei Fälle: leeres Formular absenden, `user.eventhub.test` (ohne @) mit Passwort `123` absenden, `user@eventhub.test` mit Passwort `user123` absenden.

## Checkpoint

- Nach Aufgabe 1: Die Modell-Ausgabe zeigt jeden Tastendruck, ohne `(input)`-Handler.
- Nach Aufgabe 3: Fehlermeldungen erscheinen erst nach Verlassen eines Felds.
- Nach Aufgabe 5: Leeres Absenden zeigt beide Pflicht-Meldungen; nur der dritte Fall füllt `lastSubmit`.

## Abschlusskriterien

- Das Formular bindet beide Felder mit `[formField]`, prüft vier Regeln und zeigt deutsche Meldungen.
- Absenden führt die Aktion nur bei gültigem Formular aus; die Seite lädt nicht neu.
- Der Formularwert steht im Modell-Signal, ohne `FormControl`.

## Erweiterung

- Mache aus dem Playground eine wiederverwendbare Komponente: Selektor `app-login-form`, `output<LoginCredentials>()` namens `submitted` statt `lastSubmit`. Vergleiche das Ergebnis mit `src/app/examples/m06-signals/l04-signal-forms/login-form.ts`.
- Setze das Modell per Button „Testdaten“ mit `model.set({ email: 'user@eventhub.test', password: 'user123' })` und prüfe, ob die Felder folgen.
