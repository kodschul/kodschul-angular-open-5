import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  template: `
    <h1>Über EventHub</h1>
    <p>
      Kleine Bestands-App im NgModule-Stil. Ausgangspunkt für die Standalone-Migration (Lab 2.3).
    </p>
    <p>Beispiel-Badge: <app-level-badge level="Experte"></app-level-badge></p>
  `,
})
export class AboutComponent {}
