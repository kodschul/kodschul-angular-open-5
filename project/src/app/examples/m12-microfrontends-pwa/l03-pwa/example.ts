import { Component } from '@angular/core';
import { WorkspaceInfo, WorkspaceStep } from '../../m11-libraries/workspace-info';

@Component({
  selector: 'app-pwa-example',
  imports: [WorkspaceInfo],
  template: `
    <app-workspace-info
      lab="12.3"
      title="Progressive Web App"
      handout="output/m12-microfrontends-pwa/l03-pwa/"
      [workspaces]="['workspaces/eventhub-pwa/ (Start)', 'workspaces/eventhub-pwa-final/ (Ergebnis)']"
      [steps]="steps"
    >
      <p class="muted">Der Service Worker läuft nur im Produktions-Build, nicht mit ng serve.</p>
    </app-workspace-info>
  `,
})
export class PwaExample {
  protected readonly steps: WorkspaceStep[] = [
    { dir: '.', cmd: 'npm run api', note: 'Mock-API auf Port 3000' },
    { dir: 'workspaces/eventhub-pwa-final', cmd: 'npm install && npx ng build' },
    { dir: 'workspaces/eventhub-pwa-final', cmd: 'npm run serve:dist', note: 'http://localhost:8080' },
  ];
}
