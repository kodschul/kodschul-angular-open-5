import { Component, input } from '@angular/core';

/** Ein Schritt auf der Info-Seite: Beschreibung plus Befehl. */
export interface InfoStep {
  label: string;
  command?: string;
}

/**
 * Info-Seite für Labs, die nicht in der Kurs-App laufen, sondern in einem eigenen Workspace
 * (m13, m14). Die Werte kommen aus den Routen-Daten (withComponentInputBinding).
 */
@Component({
  selector: 'app-workspace-info',
  template: `
    <h1>Lab {{ lab() }}: {{ heading() }}</h1>
    <p class="muted">{{ summary() }}</p>

    <div class="card">
      <h2>Wo liegt der Code?</h2>
      <ul>
        @for (path of paths(); track path) {
          <li><code>{{ path }}</code></li>
        }
      </ul>
      <p class="muted">Handout: <code>{{ handout() }}</code></p>
    </div>

    <div class="card">
      <h2>Ablauf</h2>
      <ol>
        @for (step of steps(); track step.label) {
          <li>
            {{ step.label }}
            @if (step.command) {
              <pre><code>{{ step.command }}</code></pre>
            }
          </li>
        }
      </ol>
    </div>
  `,
  styles: `
    pre { background: var(--bg); padding: 0.5rem 0.75rem; border-radius: 6px; overflow-x: auto; }
  `,
})
export class WorkspaceInfo {
  readonly lab = input('');
  readonly heading = input('');
  readonly summary = input('');
  readonly paths = input<string[]>([]);
  readonly handout = input('');
  readonly steps = input<InfoStep[]>([]);
}
