import { AfterViewInit, Component, ViewContainerRef, input, viewChild } from '@angular/core';
import { DashboardConfig, loadWidget } from './dashboard-config';

// Variante 2: ViewContainerRef.createComponent – volle Kontrolle im Code (Reihenfolge, Entfernen, setInput).
@Component({
  selector: 'app-dynamic-dashboard-vcr',
  template: `
    <h1>{{ config().title }}</h1>
    <p class="muted">Variante ViewContainerRef.createComponent + setInput</p>
    <div class="grid">
      <ng-container #host />
    </div>
  `,
})
export class DynamicDashboardVcrExample implements AfterViewInit {
  readonly config = input.required<DashboardConfig>();
  private readonly host = viewChild.required('host', { read: ViewContainerRef });

  // erst nach dem ersten Rendern existiert die Einfügestelle #host
  ngAfterViewInit(): void {
    void this.render(this.config(), this.host());
  }

  private async render(config: DashboardConfig, vcr: ViewContainerRef): Promise<void> {
    vcr.clear();
    for (const widget of config.widgets) {
      const component = await loadWidget(widget.type);
      const ref = vcr.createComponent(component);
      ref.location.nativeElement.classList.add('card'); // Host-Element wie eine Karte darstellen
      for (const [name, value] of Object.entries(widget.inputs ?? {})) {
        ref.setInput(name, value); // gleiche Wirkung wie [name]="value" im Template
      }
    }
  }
}
