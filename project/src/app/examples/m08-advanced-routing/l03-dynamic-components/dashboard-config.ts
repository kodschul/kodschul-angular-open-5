import { Type } from '@angular/core';

/** Aufbau von public/dashboard-widgets.json */
export interface WidgetConfig {
  /** Schlüssel in der Widget-Registry, z. B. "stats" */
  type: string;
  /** Werte für die input()-Felder des Widgets */
  inputs?: Record<string, unknown>;
}

export interface DashboardConfig {
  title: string;
  widgets: WidgetConfig[];
}

/** Registry: Widget-Typ -> Funktion, die die Komponente per import() nachlädt (eigener Chunk je Widget). */
export const WIDGET_REGISTRY: Record<string, () => Promise<Type<unknown>>> = {
  stats: () => import('./widgets/stats-widget').then((m) => m.StatsWidget),
  'next-session': () => import('./widgets/next-session-widget').then((m) => m.NextSessionWidget),
  favorites: () => import('./widgets/favorites-widget').then((m) => m.FavoritesWidget),
};

/** Lädt die Komponente zu einem Typ; unbekannte Typen bekommen ein Platzhalter-Widget. */
export function loadWidget(type: string): Promise<Type<unknown>> {
  const loader = WIDGET_REGISTRY[type] ?? (() => import('./widgets/unknown-widget').then((m) => m.UnknownWidget));
  return loader();
}
