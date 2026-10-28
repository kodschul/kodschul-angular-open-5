import { httpResource } from '@angular/common/http';
import { Component, Type } from '@angular/core';
import { StatsWidget } from '../examples/m08-advanced-routing/l03-dynamic-components/widgets/stats-widget';

// Starter Lab 8.3: Dashboard aus einer JSON-Konfiguration.
// Die Widgets sind fertig (Beispielordner), gebaut werden Registry und dynamisches Rendern.

interface WidgetConfig {
  type: string;
  inputs?: Record<string, unknown>;
}

interface DashboardConfig {
  title: string;
  widgets: WidgetConfig[];
}

// TODO 2: Registry Typ -> () => import(...) für "stats", "next-session", "favorites"
//         Pfad der Widgets: '../examples/m08-advanced-routing/l03-dynamic-components/widgets/<datei>'
const WIDGET_REGISTRY: Record<string, () => Promise<Type<unknown>>> = {
  stats: () => Promise.resolve(StatsWidget), // vorerst statisch – in Aufgabe 2 per import() ersetzen
};

@Component({
  selector: 'app-playground',
  imports: [],
  template: `
    @if (config.hasValue()) {
      <h1>{{ config.value().title }}</h1>
      <pre class="card">{{ config.value().widgets.length }} Widgets konfiguriert</pre>
      <!-- TODO 4: Widgets per *ngComponentOutlet mit inputs rendern -->
    } @else if (config.error()) {
      <p class="error">Konfiguration nicht gefunden.</p>
    } @else {
      <p class="loading">Lade Konfiguration …</p>
    }
  `,
})
export class Playground {
  // Konfiguration aus public/ (Aufgabe 1: eigene Kopie playground-dashboard.json verwenden)
  protected readonly config = httpResource<DashboardConfig>(() => '/dashboard-widgets.json');

  // TODO 3: resource(), das zu jeder WidgetConfig die Komponente lädt
  protected readonly registry = WIDGET_REGISTRY;
}
