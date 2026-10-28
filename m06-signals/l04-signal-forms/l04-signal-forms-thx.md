# Lab 6.4: Signal Forms im Vergleich zu Reactive Forms

**Leitfragen:**

<details>
<summary>Was hat ein Formularwert mit einem Warenkorb aus Lab 6.1 gemeinsam?</summary>

Beides ist Zustand, der sich durch Benutzeraktionen ändert und aus dem andere Werte folgen (Summe bzw. „gültig“, Fehlermeldungen). Beides lässt sich als Signal halten und per `computed` auswerten.

</details>

<details>
<summary>Was müsste sich ändern, damit ein Formular ohne <code>FormControl</code> auskommt?</summary>

Der Wert müsste in einem normalen Datenobjekt liegen, und Regeln, Fehler und Zustände (`touched`, `valid`) müssten sich daraus ableiten. Genau so arbeiten Signal Forms: Das Modell ist ein Signal, das Formular eine Sicht darauf.

</details>

<details>
<summary>Würde man ein bestehendes Formular mit 40 Feldern umbauen?</summary>

Meist nicht ohne Anlass: Reactive Forms bleiben unterstützt, Tests und eigene Controls hängen daran. Neue Formulare oder ohnehin geplante Umbauten sind der bessere Zeitpunkt.

</details>

- Bei Signal Forms ist das Datenmodell ein `signal`; `form()` baut daraus einen Baum aus Feldern mit Wert, Fehlern und Zuständen als Signals.
- Regeln stehen in einer Schema-Funktion (`required`, `email`, `minLength`), nicht als Validator-Arrays am Control.
- Bindung im Template mit `[formField]`; Absenden mit `[formRoot]`.

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| Modell | Normales `signal` mit dem Formularobjekt, z. B. `{ sender: '', message: '' }`; das Formular schreibt direkt hinein |
| `form(model, schema?, options?)` | Erzeugt den Feldbaum (`FieldTree`) zum Modell; Paket `@angular/forms/signals` |
| `FieldTree` | Baum mit einem Eintrag pro Feld: `contactForm.sender`, `contactForm.message` |
| Feldzustand | `contactForm.sender()` liefert Signals wie `value()`, `errors()`, `touched()`, `valid()` |
| Schema-Funktion | Funktion `(path) => { … }`, die Regeln an Pfade hängt: `required(path.sender)` |
| `FormField` | Direktive `[formField]`, verbindet ein `<input>` mit einem Feld |
| `FormRoot` | Direktive `[formRoot]` auf `<form>`, verhindert das Neuladen und ruft beim Absenden die `submission`-Aktion auf |

## Stand der API (Angular 22)

Geprüft in `@angular/forms` 22.2.3 (Typdefinitionen `types/signals.d.ts`, Stand 28.10.2026, `prüfen` vor Kursbeginn):

- Import aus `@angular/forms/signals`; `form`, `FormField`, `FormRoot`, `submit`, `required`, `email`, `minLength` sind als `@publicApi 22.0` markiert, also stabil.
- Die Direktive heißt `FormField` mit Selektor `[formField]`; `[field]` gibt es nicht. `Field` ist nur ein Typ.
- Validatoren nehmen eine Konfiguration mit `message`, z. B. `required(path.email, { message: 'E-Mail ist Pflicht.' })`.
- Signal Forms waren in Angular 21 experimentell; Beispiele aus dieser Zeit können abweichende Namen enthalten.

## Kontaktformular mit Signal Forms

Beispiel: Anfrage an eine Speakerin mit Absender-Adresse und Nachricht.

```ts
import { FormField, FormRoot, email, form, minLength, required } from '@angular/forms/signals';

interface ContactRequest {
  sender: string;
  message: string;
}

export class SpeakerContactForm {
  protected readonly model = signal<ContactRequest>({ sender: '', message: '' });
  protected readonly sentTo = signal<string | null>(null);

  protected readonly contactForm = form(
    this.model,
    (path) => {
      required(path.sender, { message: 'Absender fehlt.' });
      email(path.sender, { message: 'Absender ist keine E-Mail-Adresse.' });
      required(path.message, { message: 'Nachricht fehlt.' });
      minLength(path.message, 20, { message: 'Bitte mindestens 20 Zeichen schreiben.' });
    },
    {
      submission: {
        action: async (field) => {
          this.sentTo.set(field().value().sender);
          return undefined; // keine Fehler vom Absenden
        },
      },
    },
  );
}
```

```html
<form [formRoot]="contactForm">
  <label for="contact-message">Nachricht</label>
  <textarea id="contact-message" [formField]="contactForm.message"></textarea>
  @if (contactForm.message().touched()) {
    @for (error of contactForm.message().errors(); track error.kind) {
      <p class="error">{{ error.message }}</p>
    }
  }
  …
  <button type="submit">Senden</button>
</form>
```

- `contactForm.message` ist das Feld (für `[formField]`), `contactForm.message()` sein Zustand (für `errors()`, `touched()`).
- `touched()` wird beim Verlassen des Felds `true`. Beim Absenden markiert `[formRoot]` alle Felder als berührt und führt die `action` nur bei gültigem Formular aus. Beides passiert nur, wenn `form()` eine `submission` in den Optionen hat; ohne sie verhindert `[formRoot]` nur das Neuladen.
- `error.kind` ist der Name der Regel (`required`, `email`, `minLength`), `error.message` der Text aus der Konfiguration.
- Das Modell ist die einzige Quelle: `model()` zeigt jederzeit den aktuellen Wert, `model.set(...)` füllt das Formular.

## Vergleich mit Reactive Forms

Zum Vergleich ein Login mit Reactive Forms (Lab 4.1–4.2):

```ts
protected readonly loginForm = new FormGroup({
  email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
});
```

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <input formControlName="email" />
  @if (loginForm.controls.email.touched && loginForm.controls.email.hasError('required')) { … }
</form>
```

| Frage | Reactive Forms | Signal Forms |
| --- | --- | --- |
| Wo liegt der Wert? | im `FormControl` (Kopie) | im eigenen `signal` (Modell) |
| Regeln | Validator-Arrays am Control | Schema-Funktion mit Pfaden |
| Fehlermeldungstext | im Template je Fehlerschlüssel | am Validator per `message` |
| Änderungen beobachten | `valueChanges` (Observable) | `value()`, `computed`, `effect` |
| Bindung | `formControlName`, `[formControl]` | `[formField]` |
| Eigene Controls | `ControlValueAccessor` (Lab 4.3) | `FormValueControl` mit `model()`; `[formField]` bindet auch bestehende `ControlValueAccessor`-Controls |
| Reife | seit Angular 2, sehr viele Bibliotheken | stabil seit v22 |

## Wann welches Formular

| Situation | Empfehlung |
| --- | --- |
| Neues Formular in einer App mit Signals | Signal Forms |
| Bestehendes Formular, keine fachliche Änderung | Reactive Forms behalten |
| Abhängigkeit von UI-Bibliotheken, die nur `ControlValueAccessor` kennen | Reactive Forms oder vorher die Bindung mit `[formField]` testen |
| Team kennt nur Reactive Forms, Termin drückt | Reactive Forms; Signal Forms an einem kleinen Formular erproben |

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| `Can't bind to 'formField'` | `FormField` fehlt in `imports` | `imports: [FormField, FormRoot]` |
| Seite lädt beim Absenden neu | `[formRoot]` fehlt auf `<form>` | `<form [formRoot]="contactForm">` |
| Fehlermeldungen sofort sichtbar | `errors()` ohne `touched()`-Abfrage | Meldungen nur bei `touched()` anzeigen |
| Absenden bewirkt nichts: keine Meldungen, keine Aktion, kein Fehler in der Konsole | `[formRoot]` ohne `submission` in den Optionen von `form()` | `submission.action` im dritten Argument von `form()` |
| `NG01915` in der Konsole | `submit(form)` selbst aufgerufen, ohne dass eine Aktion existiert | `submission.action` in `form()` angeben oder die Aktion an `submit` übergeben |
| `contactForm.sender.errors is not a function` | Feld statt Feldzustand gelesen | `contactForm.sender().errors()` |

## Fazit

- Signal Forms halten den Wert in einem eigenen Signal; Fehler, `touched` und `valid` sind abgeleitete Signals.
- Regeln stehen in einer Schema-Funktion, Meldungen direkt am Validator; `[formField]` bindet, `[formRoot]` sendet ab.
- Neue Formulare können Signal Forms nutzen; bestehende Reactive Forms bleiben, bis ein Umbau ohnehin ansteht.

Die Übung baut das Login-Formular (E-Mail, Passwort) mit Validierung und Fehlermeldungen, das Lab 9.2 an die API anschließt.
