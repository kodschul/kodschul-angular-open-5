# Lab 4.1: Typed Reactive Forms

**Leitfragen:**

<details>
<summary>Welcher Typ hat ein Formularwert nach <code>reset()</code>?</summary>

Bei einem normalen `FormControl` ist es `null`, deshalb typisiert Angular jedes Feld als `string | null`. Ein Control mit `nonNullable` springt beim Reset auf seinen Startwert zurück und bleibt `string`.

</details>

<details>
<summary>Wie baut man ein Formular, dessen Felderzahl erst zur Laufzeit feststeht?</summary>

Mit einem `FormArray`: eine Liste von Controls, in die zur Laufzeit Einträge mit `push()` kommen und mit `removeAt()` verschwinden, z. B. ein Auswahlfeld pro gebuchtem Workshop.

</details>

<details>
<summary>Wann reicht ein Template-driven Form?</summary>

Bei kleinen Formularen mit wenigen, festen Feldern und einfachen Regeln (Login, Suche, Kontakt). Sobald Felder dynamisch werden, Regeln mehrere Felder betreffen oder Logik getestet werden soll, sind Reactive Forms im Vorteil.

</details>

- Reactive Forms beschreiben das Formular als Objektbaum in der Klasse; das Template bindet nur noch an.
- Seit Angular 14 sind diese Objekte typisiert: `form.controls.email` ist ein `FormControl<string>`, Tippfehler im Feldnamen fallen beim Bauen auf.

## Recap: die Bausteine

| Klasse | Rolle | Template-Bindung |
| --- | --- | --- |
| `FormControl<T>` | ein Feld mit Wert, Status, Fehlern | `formControlName="email"` oder `[formControl]="ctrl"` |
| `FormGroup<{…}>` | benannte Felder (Objekt) | `[formGroup]="form"`, `formGroupName="adresse"` |
| `FormArray<C>` | Liste gleichartiger Controls | `formArrayName="workshops"`, darin `[formControlName]="i"` |
| `FormBuilder` / `NonNullableFormBuilder` | Kurzschreibweise zum Anlegen | – |
| `ReactiveFormsModule` | Direktiven fürs Template | in `imports` der Komponente |

## Typen: nullable und nonNullable

```ts
// Alter Stil (Starter): jedes Feld kann null werden
const form = new FormGroup({ name: new FormControl(''), tickets: new FormControl(1) });
form.value;          // Partial<{ name: string | null; tickets: number | null }>
form.reset();        // name: null, tickets: null

// Neu: NonNullableFormBuilder – reset() setzt auf den Startwert zurück
private readonly fb = inject(NonNullableFormBuilder);
readonly form = this.fb.group({
  name: ['', Validators.required],                 // FormControl<string>
  tickets: [1, [Validators.min(1), Validators.max(5)]], // FormControl<number>
});
form.reset();        // name: '', tickets: 1
```

| Schreibweise | Feldtyp | Nach `reset()` |
| --- | --- | --- |
| `new FormControl('')` | `string \| null` | `null` |
| `new FormControl('', { nonNullable: true })` | `string` | `''` |
| `inject(FormBuilder).nonNullable.group({...})` | `string` | Startwert |
| `inject(NonNullableFormBuilder).group({...})` | `string` | Startwert |
| `fb.control<Session \| null>(null)` | `Session \| null` (bewusst) | `null` |

## `value` oder `getRawValue()`

| Zugriff | Typ | Enthält deaktivierte Felder |
| --- | --- | --- |
| `form.value` | `Partial<{…}>`, jedes Feld optional | nein |
| `form.getRawValue()` | vollständiges Objekt | ja |

`value` ist `Partial`, weil deaktivierte Felder fehlen. Für das Absenden passt `getRawValue()`; der Typ lässt sich direkt einer Schnittstelle wie `Registration` zuweisen.

## `FormArray` und Objekt-Auswahl

Beispiel: ein Einladungsformular mit Gastgeber, Wunsch-Speaker und einer Gästeliste beliebiger Länge.

```ts
readonly speakers$ = this.api.getSpeakers();                       // GET /speakers

readonly invite = this.fb.group({
  host: ['', Validators.required],
  speaker: this.fb.control<Speaker | null>(null),                   // Objekt oder bewusst leer
  guests: this.fb.array<FormControl<string>>([]),                   // startet leer
});

addGuest(): void {
  this.invite.controls.guests.push(this.fb.control('', Validators.required));
}

removeGuest(index: number): void {
  this.invite.controls.guests.removeAt(index);
}
```

```html
<select formControlName="speaker">
  <option [ngValue]="null">Kein Wunsch</option>
  @for (speaker of speakers$ | async; track speaker.id) {
    <option [ngValue]="speaker">{{ speaker.name }}</option>       <!-- ganzes Objekt als Wert -->
  }
</select>

<div formArrayName="guests">
  @for (guest of invite.controls.guests.controls; track guest; let i = $index) {
    <div class="row">
      <input [formControlName]="i" />                              <!-- Name = Position im Array -->
      <button type="button" class="btn" (click)="removeGuest(i)">Entfernen</button>
    </div>
  } @empty {
    <p class="muted">Noch keine Gäste.</p>
  }
</div>
<button type="button" class="btn" (click)="addGuest()">Gast hinzufügen</button>
```

- `fb.array<FormControl<string>>([])`: Der Typparameter legt fest, welche Controls ins Array dürfen; aus dem leeren Array allein kann TypeScript keinen Typ ableiten.
- `formArrayName` umschließt die Schleife; darin heißt jedes Control nach seiner Position: `[formControlName]="i"`.
- `track guest` nutzt die Control-Instanz als Schlüssel; nach `removeAt()` bleiben die übrigen Felder erhalten.
- `[ngValue]` statt `value` übergibt ein Objekt; `value` kann nur Strings.

## Absenden mit typisiertem Objekt

```ts
interface Invitation { host: string; speakerId: number | null; guestNames: string[] }

submit(): void {
  if (this.invite.invalid) {
    this.invite.markAllAsTouched();
    return;
  }
  const raw = this.invite.getRawValue();     // { host: string; speaker: Speaker | null; guests: string[] }
  const invitation: Invitation = {
    host: raw.host,
    speakerId: raw.speaker?.id ?? null,
    guestNames: raw.guests.map((g) => g.trim()),
  };
  console.log('Einladung', invitation);
}
```

- `markAllAsTouched()` markiert alle Felder als `touched` (= „vom Nutzer schon verlassen“). Meldungen, die erst nach dem Verlassen eines Felds erscheinen sollen, werden so beim Absenden auf einen Schlag sichtbar; Lab 4.2 baut solche Meldungen.
- `getRawValue()` liefert das vollständige Objekt mit den Typen aus dem Formular; es lässt sich ohne `as` einer Schnittstelle zuweisen.
- Type Guard: `list.filter((x): x is Session => x !== null)` sagt TypeScript, dass nach dem `filter` kein `null` mehr vorkommt; das Ergebnis hat den Typ `Session[]`.

Eine Antwort der API (z. B. aus `http.post(...)`) landet in einem Feld wie `result$`, das im Klick-Handler gesetzt und im Template mit `@if (result$ | async; as saved)` angezeigt wird; die `async`-Pipe startet die Anfrage und aktualisiert die Ansicht.

## Template-driven oder Reactive?

| Kriterium | Template-driven (`ngModel`) | Reactive (`formControlName`) |
| --- | --- | --- |
| Formular definiert in | Template | Klasse |
| Typisierung | schwach | `FormControl<T>` |
| Dynamische Felder | umständlich | `FormArray` |
| Feldübergreifende Regeln | eigene Direktive | Validator auf der Gruppe (Lab 4.2) |
| Unit-Test ohne Template | nein | ja |
| Passt für | Login, Suche, Kontakt | Anmeldung, Bestellung, Admin-Masken |

Signal Forms (`@angular/forms/signals`) sind ein dritter Weg; Vergleich in Lab 6.4.

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| `Type 'string \| null' is not assignable to type 'string'` | `new FormControl('')` ohne `nonNullable` | `NonNullableFormBuilder` |
| `Cannot find control with name: '0'` | `formArrayName` fehlt um die Schleife | `<div formArrayName="workshops">` |
| Auswahl zeigt `[object Object]` oder liefert String | `value` statt `[ngValue]` | `[ngValue]="workshop"` |
| Leeres Zahlenfeld liefert `null`, obwohl Typ `number` | `<input type="number">` setzt bei leerer Eingabe `null` | `Validators.required` oder eigenes Control (Lab 4.3) |
| `getRawValue()` enthält ein Feld, das `value` nicht hat | Feld ist deaktiviert | gewollt; `value` für „nur aktive Felder“ |

## Fazit

- `NonNullableFormBuilder` liefert Felder ohne `null` im Typ; `reset()` setzt auf den Startwert zurück.
- `getRawValue()` gibt das vollständige, typisierte Objekt für das Absenden.
- `FormArray` mit `push()`/`removeAt()` bildet Felder ab, deren Anzahl erst zur Laufzeit feststeht.

Die Übung baut das EventHub-Anmeldeformular auf typisierte Controls und eine Workshop-Auswahl mit `FormArray` um.
