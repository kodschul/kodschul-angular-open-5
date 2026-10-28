# Reactive-Forms-Cheatsheet

Schnellreferenz für Modul 4 (typisierte Formulare, eigene Validatoren, ControlValueAccessor). Stand: Angular 22.2.

## Formular anlegen (Lab 4.1)

| Syntax | Wirkung |
| --- | --- |
| `imports: [ReactiveFormsModule]` | Formular-Direktiven im Template verfügbar |
| `private readonly fb = inject(NonNullableFormBuilder);` | Builder ohne `null` im Feldtyp |
| `inject(FormBuilder).nonNullable` | gleicher Builder über `FormBuilder` |
| `this.fb.group({ name: ['', Validators.required] })` | `FormGroup` mit `FormControl<string>` |
| `this.fb.group({...}, { validators: [fn] })` | Gruppe mit Gruppen-Validator |
| `this.fb.control('', { validators, asyncValidators, updateOn })` | Feld mit allen Optionen |
| `this.fb.array<FormControl<Session \| null>>([])` | leeres, typisiertes `FormArray` |
| `this.fb.control<Session \| null>(null, Validators.required)` | bewusst nullbares Feld |
| `new FormControl('', { nonNullable: true })` | einzelnes Feld ohne Builder |

## Lesen und ändern

| Syntax | Wirkung |
| --- | --- |
| `form.controls.email` | typisierter Zugriff auf ein Feld |
| `form.value` | `Partial<…>`, ohne deaktivierte Felder |
| `form.getRawValue()` | vollständiges Objekt, auch deaktivierte Felder |
| `form.reset()` | nonNullable: Startwerte; sonst `null`; setzt `touched`/`dirty` zurück |
| `ctrl.setValue(3)` / `form.patchValue({...})` | Wert setzen / Teilwerte setzen |
| `ctrl.disable()` / `ctrl.enable()` | sperren / freigeben (nicht `[disabled]` im Template) |
| `array.push(ctrl)` / `array.removeAt(i)` | Feld anhängen / entfernen |
| `form.markAllAsTouched()` | alle Meldungen beim Absenden sichtbar machen |
| `form.invalid` / `form.pending` / `form.status` | Gesamtstatus: `VALID`, `INVALID`, `PENDING`, `DISABLED` |

## Template

| Syntax | Wirkung |
| --- | --- |
| `<form [formGroup]="form" (ngSubmit)="submit()">` | Formular binden |
| `<input formControlName="email" />` | Feld binden |
| `<div formArrayName="workshops">` + `[formControlName]="i"` | Array-Einträge binden |
| `<option [ngValue]="workshop">` | Objekt als Auswahlwert |
| `@for (c of form.controls.workshops.controls; track c; let i = $index)` | über Array-Controls iterieren |
| `@if (result$ \| async; as saved)` | Ergebnis eines POST anzeigen |

## Validatoren (Lab 4.2)

| Syntax | Wirkung |
| --- | --- |
| `(control: AbstractControl): ValidationErrors \| null => …` | Form einer `ValidatorFn` |
| `return { companyEmail: { domain } }` | Fehler mit Zusatzdaten |
| `return null` | gültig (auch bei leerem Wert, das prüft `required`) |
| `function companyEmail(list = …): ValidatorFn { return (c) => … }` | Fabrik für konfigurierbare Validatoren |
| `group.get('workshops')?.value` | im Gruppen-Validator auf Felder zugreifen |
| `(c) => http.get<…>(url).pipe(map(r => r.length ? { alreadyRegistered: true } : null))` | `AsyncValidatorFn`; Observable muss abschließen |
| `updateOn: 'blur'` / `'submit'` / `'change'` | wann Wert und Validierung aktualisiert werden |
| `ctrl.hasError('required')` / `ctrl.errors?.['x']` | Fehler abfragen |
| `form.errors?.['workshopOverlap']` | Fehler des Gruppen-Validators |
| `@if (ctrl.pending) { … }` | Hinweis, solange der asynchrone Validator läuft; das Ergebnis erscheint ohne weiteren Klick |
| `ctrl.touched && ctrl.errors` | Meldung erst nach Verlassen des Felds |

## ControlValueAccessor (Lab 4.3)

| Syntax | Wirkung |
| --- | --- |
| `implements ControlValueAccessor` | Schnittstelle zur Formular-API |
| `writeValue(v)` | Formular → Control: Startwert, `setValue`, `reset` |
| `registerOnChange(fn)` | `fn(wert)` bei jeder Änderung aufrufen |
| `registerOnTouched(fn)` | `fn()` beim Verlassen/ersten Bedienen aufrufen |
| `setDisabledState(b)` | auf `disable()`/`enable()` reagieren |
| `{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => X), multi: true }` | Control anmelden |
| `{ provide: NG_VALIDATORS, useExisting: forwardRef(() => X), multi: true }` + `validate()` | Regel im Control mitliefern |
| `inject(ChangeDetectorRef).markForCheck()` | Ansicht nach `writeValue`/`setDisabledState` aktualisieren |
| `host: { '(focusout)': 'onTouched()' }` | „berührt“ beim Verlassen des Bausteins |
| `<button type="button">` | Klick im Control sendet das Formular nicht ab |

## Fehlermeldungen

| Meldung | Ursache |
| --- | --- |
| NG01203 `No value accessor for form control name: 'x'` | Element ohne Value Accessor (Provider fehlt) |
| `Cannot find control with name: '0'` | `formArrayName` fehlt um `[formControlName]="i"` |
| TS4111 `… comes from an index signature` | `errors.x` statt `errors['x']` im TypeScript-Code |
| Warnung zu `disabled attribute with a reactive form directive` | `[disabled]` statt `ctrl.disable()` |
