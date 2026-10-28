import { Component, Input } from '@angular/core';
import { Speaker } from '../../shared/models';

/** Name und Firma eines Speakers. Bleibt in dieser Übung im SharedModule. */
@Component({
  selector: 'app-speaker-chip',
  standalone: false,
  template: `
    <span class="badge" *ngIf="speaker; else unknown">{{ speaker.name }} · {{ speaker.company }}</span>
    <ng-template #unknown><span class="badge">Speaker folgt</span></ng-template>
  `,
})
export class SpeakerChip {
  @Input() speaker?: Speaker | null;
}
