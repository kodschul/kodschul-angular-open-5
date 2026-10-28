// Lab 4.3: Ticket-Zähler als eigenes Formular-Control (ControlValueAccessor).
import { ChangeDetectorRef, Component, Input, forwardRef, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

@Component({
  selector: 'app-ticket-counter',
  providers: [
    // Meldet die Komponente bei formControlName/formControl als Value Accessor an
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TicketCounter), multi: true },
    // Optional: das Control bringt seine eigene Regel mit (Grenzen min/max)
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => TicketCounter), multi: true },
  ],
  host: { '(focusout)': 'onTouched()' },
  template: `
    <div class="row" role="group" aria-label="Anzahl Tickets">
      <button type="button" class="btn" (click)="change(-1)" [disabled]="disabled || value <= min" aria-label="Ein Ticket weniger">−</button>
      <output aria-live="polite">{{ value }}</output>
      <button type="button" class="btn" (click)="change(1)" [disabled]="disabled || value >= max" aria-label="Ein Ticket mehr">+</button>
    </div>
  `,
})
export class TicketCounter implements ControlValueAccessor, Validator {
  @Input() min = 1;
  @Input() max = 5;

  value = 1;
  disabled = false;

  private readonly cdr = inject(ChangeDetectorRef);
  private onChange: (value: number) => void = () => {};
  onTouched: () => void = () => {};

  // Formular → Control: setValue(), reset(), Startwert
  writeValue(value: number | null): void {
    this.value = value ?? this.min;
    this.cdr.markForCheck(); // kein Event in dieser Komponente: Ansicht ausdrücklich zur Prüfung markieren
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Formular → Control: control.disable() / enable()
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // Control → Formular: Klick auf Minus/Plus
  change(delta: number): void {
    const next = Math.min(this.max, Math.max(this.min, this.value + delta));
    if (next === this.value) return;
    this.value = next;
    this.onChange(next);
    this.onTouched();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as number | null;
    return value === null || value < this.min || value > this.max ? { ticketRange: { min: this.min, max: this.max } } : null;
  }
}
