import { Component } from '@angular/core';
import { WorkspaceInfo, WorkspaceStep } from '../workspace-info';

@Component({
  selector: 'app-nx-example',
  imports: [WorkspaceInfo],
  template: `
    <app-workspace-info
      lab="11.1"
      title="Nx Workspace"
      handout="output/m11-libraries/l01-nx/"
      [workspaces]="['workspaces/nx-eventhub/']"
      [steps]="steps"
    >
      <p>Das Ergebnis (ui-Library mit Session-Karte) steht vollständig in der Lösung des Labs.</p>
    </app-workspace-info>
  `,
})
export class NxExample {
  protected readonly steps: WorkspaceStep[] = [
    { dir: '.', cmd: 'npm run api', note: 'Mock-API auf Port 3000' },
    { dir: 'workspaces/nx-eventhub', cmd: 'npm install' },
    { dir: 'workspaces/nx-eventhub', cmd: 'npx nx serve eventhub', note: 'http://localhost:4210' },
    { dir: 'workspaces/nx-eventhub', cmd: 'npx nx graph', note: 'Projektgraph im Browser' },
  ];
}
