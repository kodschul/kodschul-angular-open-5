import { Component } from '@angular/core';
import { WorkspaceInfo, WorkspaceStep } from '../workspace-info';

@Component({
  selector: 'app-elements-example',
  imports: [WorkspaceInfo],
  template: `
    <app-workspace-info
      lab="11.3"
      title="Angular Elements"
      handout="output/m11-libraries/l03-elements/"
      [workspaces]="['workspaces/eventhub-elements/']"
      [steps]="steps"
    />
  `,
})
export class ElementsExample {
  protected readonly steps: WorkspaceStep[] = [
    { dir: 'workspaces/eventhub-elements', cmd: 'npm install && npx ng build' },
    { dir: 'workspaces/eventhub-elements', cmd: 'npm run serve:dist', note: 'Port 4230' },
    { dir: '–', cmd: 'http://localhost:4230/demo.html öffnen', note: 'statische Seite mit <eventhub-signup>' },
  ];
}
