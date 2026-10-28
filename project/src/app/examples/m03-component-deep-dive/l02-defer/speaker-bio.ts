import { Component, Input } from '@angular/core';
import { Speaker } from '../../../shared/models';

// Eigenständige Komponente: nur so kann @defer sie in einen eigenen Chunk auslagern.
@Component({
  selector: 'app-speaker-bio',
  template: `
    @if (speaker) {
      <div class="card">
        <h3>{{ speaker.name }}</h3>
        <p class="muted">{{ speaker.company }}</p>
        <p>{{ speaker.bio }}</p>
      </div>
    } @else {
      <p class="muted">Für diese Session ist noch kein Speaker eingetragen.</p>
    }
  `,
})
export class SpeakerBio {
  @Input() speaker: Speaker | null | undefined = null;
}
