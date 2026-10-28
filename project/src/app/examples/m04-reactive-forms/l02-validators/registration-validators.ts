// Eigene Validatoren für das EventHub-Anmeldeformular (Lab 4.2).
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { map } from 'rxjs';
import { API_URL } from '../../../shared/api';
import { Registration, Session } from '../../../shared/models';

export const FREEMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'gmx.de',
  'gmx.net',
  'web.de',
  'yahoo.com',
  'yahoo.de',
  'outlook.com',
  'hotmail.com',
  't-online.de',
  'icloud.com',
];

/** Synchron, ein Feld: keine Freemail-Domain. Fabrikfunktion, damit die Liste austauschbar ist. */
export function companyEmail(blocked: string[] = FREEMAIL_DOMAINS): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const domain = String(control.value ?? '').split('@')[1]?.trim().toLowerCase();
    if (!domain) return null; // leeres Feld oder ohne @: Sache von required und email
    return blocked.includes(domain) ? { companyEmail: { domain } } : null;
  };
}

/** Synchron, feldübergreifend: sitzt auf der FormGroup und vergleicht alle gewählten Workshops. */
export const workshopsDoNotOverlap: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const selected = (group.get('workshops')?.value ?? []) as (Session | null)[];
  const workshops = selected.filter((w): w is Session => w !== null);
  for (let i = 0; i < workshops.length; i++) {
    for (let j = i + 1; j < workshops.length; j++) {
      if (overlaps(workshops[i], workshops[j])) {
        return { workshopOverlap: { first: workshops[i].title, second: workshops[j].title } };
      }
    }
  }
  return null;
};

function overlaps(a: Session, b: Session): boolean {
  const startA = Date.parse(a.start);
  const startB = Date.parse(b.start);
  const endA = startA + a.durationMin * 60_000;
  const endB = startB + b.durationMin * 60_000;
  return startA < endB && startB < endA;
}

/** Asynchron: fragt die API, ob die E-Mail schon angemeldet ist. Läuft nur, wenn alle synchronen Regeln passen. */
export function emailNotRegistered(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl) =>
    http
      .get<Registration[]>(`${API_URL}/registrations`, { params: { email: String(control.value) } })
      .pipe(map((found) => (found.length > 0 ? { alreadyRegistered: true } : null)));
}
