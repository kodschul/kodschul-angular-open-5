import { Component, Input } from '@angular/core';
import { SessionLevel } from '../../../shared/models';
import { Highlight } from './highlight.directive';
import { Tooltip } from './tooltip.directive';

// Komponente mit eigenem Template; Hover und Tooltip kommen per Komposition dazu.
@Component({
  selector: 'app-session-badge',
  hostDirectives: [
    // Eingabe "appHighlight" der Direktive heißt am Badge "color"
    { directive: Highlight, inputs: ['appHighlight: color'] },
    { directive: Tooltip, inputs: ['appTooltip: tooltip'] },
  ],
  host: {
    class: 'badge',
    '[class.badge-ok]': "level === 'Einsteiger'",
    '[class.badge-warn]': "level === 'Fortgeschritten'",
    '[class.badge-error]': "level === 'Experte'",
  },
  template: `{{ level }}`,
})
export class SessionBadge {
  @Input() level: SessionLevel = 'Einsteiger';
}
