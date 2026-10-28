import { Component, Input } from '@angular/core';
import { SessionLevel } from '../../shared/models';

/** Farbiges Badge je Level. Noch im SharedModule deklariert (standalone: false). */
@Component({
  selector: 'app-level-badge',
  standalone: false,
  template: `<span class="badge" [ngClass]="cssClass">{{ level }}</span>`,
})
export class LevelBadge {
  @Input({ required: true }) level!: SessionLevel;

  get cssClass(): string {
    if (this.level === 'Experte') return 'badge-error';
    return this.level === 'Fortgeschritten' ? 'badge-warn' : 'badge-ok';
  }
}
