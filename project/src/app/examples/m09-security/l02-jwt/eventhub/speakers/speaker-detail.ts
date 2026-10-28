import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { API_URL, Speaker } from '../data';

@Component({
  selector: 'eh-speaker-detail',
  template: `
    @if (speaker.hasValue()) {
      <article class="card">
        <h1>{{ speaker.value().name }}</h1>
        <p class="muted">{{ speaker.value().company }}</p>
        <p>{{ speaker.value().bio }}</p>
      </article>
    } @else if (speaker.error()) {
      <p class="error">Speaker nicht gefunden.</p>
    } @else {
      <p class="loading">Lade Speaker …</p>
    }
  `,
})
export class SpeakerDetail {
  /** Routen-Parameter :id, gebunden über withComponentInputBinding (Lab 2.2). */
  readonly id = input.required<string>();
  protected readonly speaker = httpResource<Speaker>(() => `${API_URL}/speakers/${this.id()}`);
}
