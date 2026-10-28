import { Component, input } from '@angular/core';

/** Ein Befehl mit Arbeitsordner, relativ zu output/project/. */
export interface WorkspaceStep {
  dir: string;
  cmd: string;
  note?: string;
}

/**
 * Infoseite für Labs, die in einem eigenen Workspace unter output/project/workspaces/ laufen.
 * Die Kurs-App selbst enthält für diese Labs keinen Code.
 */
@Component({
  selector: 'app-workspace-info',
  template: `
    <h1>Lab {{ lab() }}: {{ title() }}</h1>
    <p class="muted">
      Dieses Lab läuft nicht in der Kurs-App, sondern in eigenen Workspaces. Handout:
      <code>{{ handout() }}</code>
    </p>

    <section class="card">
      <h2>Workspaces</h2>
      <ul>
        @for (path of workspaces(); track path) {
          <li><code>output/project/{{ path }}</code></li>
        }
      </ul>
    </section>

    @if (steps().length) {
      <section class="card">
        <h2>Start</h2>
        <ol>
          @for (step of steps(); track $index) {
            <li>
              <code>cd {{ step.dir }}</code> · <code>{{ step.cmd }}</code>
              @if (step.note) {
                <span class="muted"> – {{ step.note }}</span>
              }
            </li>
          }
        </ol>
      </section>
    }

    <ng-content />
  `,
})
export class WorkspaceInfo {
  readonly lab = input.required<string>();
  readonly title = input.required<string>();
  readonly handout = input.required<string>();
  readonly workspaces = input<string[]>([]);
  readonly steps = input<WorkspaceStep[]>([]);
}
