import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { API_URL, Speaker } from '../data';

@Component({
  selector: 'eh-speaker-list',
  imports: [RouterLink],
  template: `
    <h1>Speaker</h1>
    <ul>
      @for (sp of speakers(); track sp.id) {
        <!-- relativer Link: aus "speakers" wird "speakers/3" -->
        <li><a [routerLink]="[sp.id]">{{ sp.name }}</a> <span class="muted">({{ sp.company }})</span></li>
      }
    </ul>
  `,
})
export class SpeakerList {
  protected readonly speakers = toSignal(inject(HttpClient).get<Speaker[]>(`${API_URL}/speakers`), {
    initialValue: [],
  });
}
