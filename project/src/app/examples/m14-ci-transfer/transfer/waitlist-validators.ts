import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { WaitlistEntry } from './waitlist.model';

/**
 * Eigener Validator (Lab 4.2): Die E-Mail steht für diese Session noch nicht auf der Warteliste.
 * Liest die Einträge über eine Funktion, damit er immer den aktuellen Store-Stand sieht.
 */
export function notOnWaitlist(entries: () => WaitlistEntry[], sessionId: () => number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = String(control.value ?? '').trim().toLowerCase();
    if (!email) return null;
    const exists = entries().some(
      (entry) => entry.waitlistSessionId === sessionId() && entry.email.toLowerCase() === email,
    );
    return exists ? { notOnWaitlist: { email } } : null;
  };
}
