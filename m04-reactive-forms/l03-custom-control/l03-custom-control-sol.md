# Lab 4.3 – Lösung: Eigenes Formular-Control mit ControlValueAccessor

Referenz: `src/app/examples/m04-reactive-forms/l03-custom-control/` (`ticket-counter.ts`, `example.ts`), im Browser `/examples/m04-reactive-forms/l03-custom-control`. Das Beispiel enthält auch die Validierung aus der Erweiterung.

## Aufgabe 1: Fehlerbild ohne Anbindung

```text
ERROR RuntimeError: NG01203: No value accessor for form control name: 'tickets'.
```

`formControlName` sucht auf dem Element einen Value Accessor. `<app-ticket-counter>` bietet noch keinen an. Der Zähler bleibt im Template; nach Aufgabe 2 verschwindet der Fehler.

```ts
imports: [ReactiveFormsModule, AsyncPipe, DatePipe, TicketCounter],
```

```html
<label for="tickets">Tickets</label>
<app-ticket-counter formControlName="tickets" />
```

## Aufgaben 2–5: `TicketCounter` als CVA

Import-Zeilen erweitern:

```ts
import { ChangeDetectorRef, Component, Input, forwardRef, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
```

Komponente:

```ts
@Component({
  selector: 'app-ticket-counter',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TicketCounter), multi: true }],
  host: { '(focusout)': 'onTouched()' },
  template: `
    <div class="row" role="group" aria-label="Anzahl Tickets">
      <button type="button" class="btn" (click)="change(-1)" [disabled]="disabled || value <= min" aria-label="Ein Ticket weniger">−</button>
      <output aria-live="polite">{{ value }}</output>
      <button type="button" class="btn" (click)="change(1)" [disabled]="disabled || value >= max" aria-label="Ein Ticket mehr">+</button>
    </div>
  `,
})
export class TicketCounter implements ControlValueAccessor {
  @Input() min = 1;
  @Input() max = 5;

  value = 1;
  disabled = false;

  private readonly cdr = inject(ChangeDetectorRef);
  private onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.value = value ?? this.min;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  change(delta: number): void {
    const next = Math.min(this.max, Math.max(this.min, this.value + delta));
    if (next === this.value) return;
    this.value = next;
    this.onChange(next);
    this.onTouched();
  }
}
```

- `forwardRef`: Der Provider steht im Decorator der Klasse, die er referenziert; `forwardRef` löst den Verweis erst später auf.
- `onTouched` ist öffentlich, weil die `host`-Bindung `(focusout)` es aufruft; `onChange` bleibt privat.
- `value ?? this.min`: Mit `NonNullableFormBuilder` kommt nie `null`; derselbe Zähler an einem nullbaren Control (`new FormControl(null)`) oder mit `ngModel` zeigt dann `min` statt einer leeren Anzeige.

## Aufgabe 6: Obergrenze und Label

```html
<label>Tickets</label>
<app-ticket-counter formControlName="tickets" [max]="5" />
```

Das `<label for="tickets">` verliert sein Ziel, weil es kein `<input id="tickets">` mehr gibt; deshalb steht es ohne `for`, die Beschriftung übernimmt `aria-label="Anzahl Tickets"` im Baustein.

## Aufgabe 7: Sperren

Siehe `setDisabledState` oben. Im Template sperren `[disabled]="disabled || …"` beide Buttons.

## Aufgabe 8: Test

| Aktion | Zähler | Statuszeile |
| --- | --- | --- |
| Start | 1 | Wert 1 · unberührt · frei |
| Klick „+“ | 2 | Wert 2 · berührt · frei |
| „Auf 3 setzen“ | 3 | Wert 3 · berührt · frei |
| „Tickets sperren“ | 3, Buttons grau | Wert 3 · berührt · gesperrt |
| „Tickets freigeben“ | 3 | Wert 3 · berührt · frei |
| „Zurücksetzen“ | 1 | Wert 1 · unberührt · frei |

`reset()` setzt `touched` zurück; der Zähler zeigt 1, weil `writeValue(1)` mit `markForCheck()` ankommt.

## Aufgabe 9: ohne `markForCheck()`

| Aktion (nach Neuladen) | Zähler | Statuszeile |
| --- | --- | --- |
| „Auf 3 setzen“ | 1 (veraltet) | Wert 3 · unberührt · frei |
| danach „+“ | 4 | Wert 4 · berührt · frei |

Der Klick auf „Auf 3 setzen“ ist ein Event der Playground-Komponente, nicht des Zählers; dessen Ansicht wird ohne Vormerkung nicht neu geprüft. Intern steht `value` schon auf 3, deshalb springt die Anzeige beim nächsten „+“ direkt auf 4.

Warum neu laden: Hatte der Zähler vorher den Fokus (z. B. nach einem Klick auf „+“), verliert er ihn beim Klick auf „Auf 3 setzen“. Das `focusout` ist ein Event im Zähler und löst dessen Prüfung aus, der Fehler bleibt dann verdeckt.

## Aufgabe 10: Anmeldung mit gesperrtem Feld

`submit()` nutzt `getRawValue()`, deshalb enthält die Anmeldung `tickets: 3` trotz Sperre. Mit `form.value` würde `tickets` fehlen.

## Erweiterung

Validierung im Control (vollständig im Beispiel `ticket-counter.ts`):

```ts
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

providers: [
  { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TicketCounter), multi: true },
  { provide: NG_VALIDATORS, useExisting: forwardRef(() => TicketCounter), multi: true },
],

export class TicketCounter implements ControlValueAccessor, Validator {
  // …
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as number | null;
    return value === null || value < this.min || value > this.max
      ? { ticketRange: { min: this.min, max: this.max } }
      : null;
  }
}
```

```ts
tickets: [1],   // Grenzen prüft TicketCounter selbst
```

```html
<button type="button" class="btn" (click)="tickets.setValue(9)">Auf 9 setzen</button>
@if (tickets.hasError('ticketRange')) {
  <p class="error">Bitte 1 bis 5 Tickets wählen.</p>
}
```

Pfeiltasten:

```ts
host: {
  '(focusout)': 'onTouched()',
  '(keydown.arrowup)': 'change(1); $event.preventDefault()',
  '(keydown.arrowdown)': 'change(-1); $event.preventDefault()',
},
```

`preventDefault()` verhindert, dass die Seite beim Drücken der Pfeiltasten scrollt. Die Tasten wirken, sobald einer der beiden Buttons den Fokus hat.
