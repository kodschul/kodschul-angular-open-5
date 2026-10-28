import { Component } from '@angular/core';

// Platzhalter für Typen, die die Registry nicht kennt (Tippfehler in der JSON-Datei).
@Component({
  selector: 'app-unknown-widget',
  template: `<p class="error">Unbekannter Widget-Typ – Eintrag in der Konfiguration prüfen.</p>`,
})
export class UnknownWidget {}
