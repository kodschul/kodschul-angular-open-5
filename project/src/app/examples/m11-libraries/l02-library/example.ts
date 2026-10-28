import { Component } from '@angular/core';
import { WorkspaceInfo, WorkspaceStep } from '../workspace-info';

@Component({
  selector: 'app-library-example',
  imports: [WorkspaceInfo],
  template: `
    <app-workspace-info
      lab="11.2"
      title="Angular Library bauen und veröffentlichen"
      handout="output/m11-libraries/l02-library/"
      [workspaces]="['workspaces/eventhub-ui-lib/', 'workspaces/eventhub-ui-consumer/']"
      [steps]="steps"
    />
  `,
})
export class LibraryExample {
  protected readonly steps: WorkspaceStep[] = [
    { dir: 'workspaces/eventhub-ui-lib', cmd: 'npm install && npx ng build eventhub-ui' },
    { dir: 'workspaces/eventhub-ui-lib/dist/eventhub-ui', cmd: 'npm pack', note: 'erzeugt eventhub-ui-0.1.0.tgz' },
    { dir: 'workspaces/eventhub-ui-consumer', cmd: 'npm install ../eventhub-ui-lib/dist/eventhub-ui/eventhub-ui-0.1.0.tgz' },
    { dir: 'workspaces/eventhub-ui-consumer', cmd: 'npx ng serve', note: 'http://localhost:4220' },
  ];
}
