import { NgComponentOutlet } from '@angular/common';
import { Component, input, resource } from '@angular/core';
import { DashboardConfig, loadWidget } from './dashboard-config';

// Variante 1: NgComponentOutlet rendert eine Komponente, deren Klasse erst zur Laufzeit feststeht.
@Component({
  selector: 'app-dynamic-dashboard-example',
  imports: [NgComponentOutlet],
  template: `
    <h1>{{ config().title }}</h1>
    <p class="muted">Aufbau aus <code>public/dashboard-widgets.json</code> · Variante NgComponentOutlet</p>
    @if (widgets.isLoading()) {
      <p class="loading">Lade Widgets …</p>
    }
    <div class="grid">
      @for (w of widgets.value() ?? []; track $index) {
        <section class="card">
          <ng-container *ngComponentOutlet="w.component; inputs: w.inputs" />
        </section>
      }
    </div>
  `,
})
export class DynamicDashboardExample {
  /** kommt vom Resolver (resolve: { config: … }) über withComponentInputBinding */
  readonly config = input.required<DashboardConfig>();

  /** lädt alle Widget-Klassen der Konfiguration per import(), sobald config feststeht */
  protected readonly widgets = resource({
    params: () => this.config().widgets,
    loader: ({ params }) =>
      Promise.all(params.map(async (w) => ({ component: await loadWidget(w.type), inputs: w.inputs ?? {} }))),
  });
}
