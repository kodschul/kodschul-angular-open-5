import { Directive, Input } from '@angular/core';

// Attribut-Direktive: färbt das Host-Element beim Hover ein.
// host-Metadaten ersetzen @HostBinding und @HostListener.
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'active = true',
    '(mouseleave)': 'active = false',
    '[style.backgroundColor]': 'active ? (color || defaultColor) : null',
  },
})
export class Highlight {
  // <p appHighlight="#ffe08a"> setzt die Farbe; leeres Attribut nutzt defaultColor
  @Input('appHighlight') color = '';

  readonly defaultColor = '#fff3c4';
  active = false;
}
