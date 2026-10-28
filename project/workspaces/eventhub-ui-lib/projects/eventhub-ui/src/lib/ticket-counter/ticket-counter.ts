import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Ticket-Zähler als Formular-Control (Minus/Plus, Grenzen über min/max).
 * Fassung des TicketCounter aus Lab 4.3, umgestellt auf input() und signal() (Lab 6.1, 6.3).
 */
@Component({
  selector: 'eh-ticket-counter',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TicketCounter), multi: true }],
  host: { '(focusout)': 'onTouched()' },
  template: `
    <span class="eh-counter">
      <button type="button" (click)="change(-1)" [disabled]="disabled() || value() <= min()" aria-label="Weniger">−</button>
      <output aria-live="polite">{{ value() }}</output>
      <button type="button" (click)="change(1)" [disabled]="disabled() || value() >= max()" aria-label="Mehr">+</button>
    </span>
  `,
  styles: `
    .eh-counter { display: inline-flex; align-items: center; gap: 0.5rem; }
    button { width: 2rem; height: 2rem; border-radius: 6px; border: 1px solid #dde1e8; background: #fff; cursor: pointer; }
    output { min-width: 1.5rem; text-align: center; font-weight: 600; }
  `,
})
export class TicketCounter implements ControlValueAccessor {
  readonly min = input(1);
  readonly max = input(5);

  protected readonly value = signal(1);
  protected readonly disabled = signal(false);

  private onChange: (value: number) => void = () => {};
  protected onTouched: () => void = () => {};

  protected change(delta: number): void {
    const next = Math.min(this.max(), Math.max(this.min(), this.value() + delta));
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }

  writeValue(value: number | null): void {
    this.value.set(value ?? this.min());
  }
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
