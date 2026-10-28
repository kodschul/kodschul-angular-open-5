// Lab 2.3: Übersicht zur Migration von workspaces/legacy-ngmodule (die Migration selbst läuft im Workspace).
import { Component } from '@angular/core';

interface MigrationStep {
  mode: string;
  label: string;
  changes: string[];
}

@Component({
  selector: 'app-migration-example',
  template: `
    <h1>Bestandsprojekt migrieren</h1>
    <p class="muted">
      Workspace: <code>output/project/workspaces/legacy-ngmodule</code> · Befehl:
      <code>npx ng generate &#64;angular/core:standalone --mode=&lt;Modus&gt; --path=./</code>
    </p>
    @for (step of steps; track step.mode; let i = $index) {
      <div class="card">
        <h3>Schritt {{ i + 1 }}: <code>{{ step.mode }}</code></h3>
        <p class="muted">{{ step.label }}</p>
        <ul>
          @for (change of step.changes; track change) {
            <li>{{ change }}</li>
          }
        </ul>
      </div>
    }
    <div class="card">
      <h3>Danach von Hand</h3>
      <ul>
        @for (todo of manual; track todo) {
          <li>{{ todo }}</li>
        }
      </ul>
    </div>
  `,
})
export class MigrationExample {
  protected readonly steps: MigrationStep[] = [
    {
      mode: 'convert-to-standalone',
      label: 'Convert all components, directives and pipes to standalone',
      changes: [
        'standalone: false entfernt, Komponenten bekommen eigene imports (NgIf, NgFor, AsyncPipe, DatePipe, RouterLink …)',
        'declarations wandern in die imports der Module; AppComponent bleibt deklariert (Bootstrap-Komponente)',
      ],
    },
    {
      mode: 'prune-ng-modules',
      label: 'Remove unnecessary NgModule classes',
      changes: ['shared.module.ts gelöscht und aus allen imports entfernt', 'SessionsModule bleibt (enthält Routen)'],
    },
    {
      mode: 'standalone-bootstrap',
      label: 'Bootstrap the application using standalone APIs',
      changes: [
        'app.module.ts gelöscht, main.ts ruft bootstrapApplication(AppComponent, …) auf',
        'Module landen in importProvidersFrom(BrowserModule, HttpClientModule, AppRoutingModule)',
      ],
    },
  ];

  protected readonly manual = [
    'importProvidersFrom(...) durch provideRouter(routes) und provideHttpClient() ersetzen, Providers nach app.config.ts',
    'AppRoutingModule -> app.routes.ts, SessionsModule + SessionsRoutingModule -> sessions.routes.ts',
    'ungenutzten Import platformBrowser und veralteten Kommentar in main.ts entfernen',
  ];
}
