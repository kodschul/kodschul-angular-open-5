import { InjectionToken } from '@angular/core';

/**
 * Absolute URL der Login-Seite. Im Workspace "/login"; die Kurs-App setzt den Wert
 * per Routen-Provider, weil das Beispiel unter /examples/m09-security/l02-jwt liegt.
 */
export const LOGIN_URL = new InjectionToken<string>('LOGIN_URL', {
  providedIn: 'root',
  factory: () => '/login',
});
