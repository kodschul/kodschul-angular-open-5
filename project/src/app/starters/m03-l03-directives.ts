// Starter Lab 3.3: Session-Liste mit einfachem Level-Badge.
// Aufgabe: appHighlight und appTooltip als Direktiven bauen und per hostDirectives
// zu einer SessionBadge-Komponente zusammensetzen (siehe Übung).
import { AsyncPipe } from '@angular/common';
import { Component, Renderer2, inject } from '@angular/core';
import { SessionApi } from '../shared/api';

// Gegeben: erzeugt die Tooltip-Blase über Renderer2 (reine DOM-Arbeit).
// Verwendung in der Direktive: renderer.appendChild(host, createBubble(renderer, text))
export function createBubble(renderer: Renderer2, text: string): HTMLElement {
  const bubble: HTMLElement = renderer.createElement('span');
  renderer.setAttribute(bubble, 'role', 'tooltip');
  renderer.appendChild(bubble, renderer.createText(text));
  const styles: Record<string, string> = {
    position: 'absolute',
    bottom: '125%',
    left: '0',
    padding: '0.3rem 0.6rem',
    background: '#1d2330',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    zIndex: '10',
  };
  for (const [name, value] of Object.entries(styles)) renderer.setStyle(bubble, name, value);
  return bubble;
}

// TODO Aufgabe 2: Direktive Highlight (selector [appHighlight])
// TODO Aufgabe 4: Direktive Tooltip (selector [appTooltip])
// TODO Aufgabe 6: Komponente SessionBadge mit hostDirectives

@Component({
  selector: 'app-playground',
  imports: [AsyncPipe],
  template: `
    <h1>Sessions</h1>

    @if (sessions$ | async; as sessions) {
      @for (session of sessions; track session.id) {
        <div class="card">
          <div class="row">
            <strong>{{ session.title }}</strong>
            <span
              class="badge"
              [class.badge-ok]="session.level === 'Einsteiger'"
              [class.badge-warn]="session.level === 'Fortgeschritten'"
              [class.badge-error]="session.level === 'Experte'"
              >{{ session.level }}</span
            >
          </div>
        </div>
      }
    } @else {
      <p class="loading">Lade Sessions …</p>
    }
  `,
})
export class Playground {
  private readonly api = inject(SessionApi);
  readonly sessions$ = this.api.getSessions();
}
