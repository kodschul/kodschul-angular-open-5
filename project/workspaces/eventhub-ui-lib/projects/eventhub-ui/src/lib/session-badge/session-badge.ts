import { Component, computed, input } from '@angular/core';
import { BadgeLevel, levelClass } from '../internal/level-style';

/**
 * Level-Badge einer Session.
 * Vereinfachte Fassung der SessionBadge aus Lab 3.3: Tooltip über das title-Attribut statt Host Directives,
 * Level als input() (Lab 6.3), Farben als eigene Styles, damit das Paket ohne globale Kurs-Styles auskommt.
 */
@Component({
  selector: 'eh-session-badge',
  host: {
    '[attr.title]': 'tooltip()',
  },
  template: `<span class="eh-badge" [class]="cssClass()">{{ level() }}</span>`,
  styles: `
    .eh-badge { display: inline-block; padding: 0.1rem 0.5rem; border-radius: 999px; font-size: 0.8rem; background: #dde1e8; }
    .eh-badge--ok { background: #d8f0df; color: #1b7f3b; }
    .eh-badge--info { background: #dbe7fb; color: #1d4f9c; }
    .eh-badge--warn { background: #fde9cc; color: #b25e00; }
  `,
})
export class SessionBadge {
  readonly level = input.required<BadgeLevel>();
  /** Optionaler Tooltip; ohne Angabe erscheint das Level. */
  readonly hint = input<string>();

  protected readonly cssClass = computed(() => `eh-badge ${levelClass(this.level())}`);
  protected readonly tooltip = computed(() => this.hint() ?? `Level: ${this.level()}`);
}
