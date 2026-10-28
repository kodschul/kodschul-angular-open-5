import { Component } from '@angular/core';
import { WorkspaceInfo, WorkspaceStep } from '../../m11-libraries/workspace-info';

@Component({
  selector: 'app-native-federation-example',
  imports: [WorkspaceInfo],
  template: `
    <app-workspace-info
      lab="12.2"
      title="Micro-Frontend mit Native Federation"
      handout="output/m12-microfrontends-pwa/l02-native-federation/"
      [workspaces]="['workspaces/federation-host/', 'workspaces/federation-admin/']"
      [steps]="steps"
    >
      <p class="muted">Host und Kurs-App nutzen beide Port 4200: die Kurs-App vorher beenden.</p>
    </app-workspace-info>
  `,
})
export class NativeFederationExample {
  protected readonly steps: WorkspaceStep[] = [
    { dir: '.', cmd: 'npm run api', note: 'Mock-API auf Port 3000' },
    { dir: 'workspaces/federation-admin', cmd: 'npm install && npx ng serve', note: 'Remote auf http://localhost:4201' },
    { dir: 'workspaces/federation-host', cmd: 'npm install && npx ng serve', note: 'Host auf http://localhost:4200/admin' },
  ];
}
