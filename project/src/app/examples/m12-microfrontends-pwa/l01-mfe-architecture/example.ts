import { Component } from '@angular/core';
import { WorkspaceInfo } from '../../m11-libraries/workspace-info';

/** Lab 12.1 ist eine Entscheidungsübung ohne Code; die Seite fasst die Entscheidungstabelle zusammen. */
@Component({
  selector: 'app-mfe-architecture-example',
  imports: [WorkspaceInfo],
  template: `
    <app-workspace-info
      lab="12.1"
      title="Micro-Frontend-Architektur"
      handout="output/m12-microfrontends-pwa/l01-mfe-architecture/"
    >
      <section class="card">
        <h2>Ansätze im Überblick</h2>
        <table>
          <thead>
            <tr><th>Ansatz</th><th>Teams unabhängig deploybar</th><th>Gemeinsames Angular</th><th>Typischer Einsatz</th></tr>
          </thead>
          <tbody>
            @for (row of rows; track row[0]) {
              <tr>
                @for (cell of row; track $index) {
                  <td>{{ cell }}</td>
                }
              </tr>
            }
          </tbody>
        </table>
      </section>
      <p class="muted">Die Szenarien und Lösungen stehen im Handout. Code zu Native Federation: Lab 12.2.</p>
    </app-workspace-info>
  `,
  styles: `
    table { border-collapse: collapse; width: 100%; }
    th, td { text-align: left; padding: 0.4rem; border-bottom: 1px solid var(--border); vertical-align: top; }
  `,
})
export class MfeArchitectureExample {
  protected readonly rows = [
    ['Monorepo (Nx, Lab 11.1)', 'nein, ein Build', 'ja, eine Version', '1–3 Teams, gemeinsamer Release'],
    ['Native Federation', 'ja', 'ja, zur Laufzeit geteilt', 'mehrere Angular-Teams, eigene Releases'],
    ['Webpack Module Federation', 'ja', 'ja, zur Laufzeit geteilt', 'Bestand mit Webpack-Build'],
    ['Web Components (Lab 11.3)', 'ja', 'nein, jedes bringt eigenes mit', 'Widgets in fremden Seiten, gemischte Frameworks'],
    ['iframes', 'ja', 'nein, völlig getrennt', 'Altanwendungen einbetten, harte Isolation'],
  ];
}
