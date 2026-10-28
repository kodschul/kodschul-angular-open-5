import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-level-badge',
  standalone: false,
  template: `<span class="badge" [ngClass]="cssClass">{{ level }}</span>`,
})
export class LevelBadgeComponent {
  @Input() level = '';

  get cssClass(): string {
    return this.level === 'Experte'
      ? 'badge-error'
      : this.level === 'Fortgeschritten'
        ? 'badge-warn'
        : 'badge-ok';
  }
}
