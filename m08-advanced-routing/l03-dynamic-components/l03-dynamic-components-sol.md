# Lab 8.3 – Lösung: Dynamische Komponenten

Fertiges Beispiel: `src/app/examples/m08-advanced-routing/l03-dynamic-components/` (`example.ts`, `example-vcr.ts`, `dashboard-config.ts`, `dashboard-config.resolver.ts`, `widgets/`), im Browser unter `/examples/m08-advanced-routing/l03-dynamic-components` und `/examples/m08-advanced-routing/l03-dynamic-components/vcr`. Das Beispiel lädt die Konfiguration per Resolver; die Playground-Lösung lädt sie selbst.

## Aufgabe 1: Konfiguration und Starter

`public/playground-dashboard.json` liegt bereit; im Starter ändert sich nur die URL:

```ts
protected readonly config = httpResource<DashboardConfig>(() => '/playground-dashboard.json');
```

## Aufgabe 2: Registry mit import()

Jeder Pfad steht ausgeschrieben in `import()`: Der Build erkennt die Zieldatei nur an einem festen Text und legt dafür einen eigenen Chunk an. Ein Pfad aus einer Variablen funktioniert nicht zuverlässig.

```ts
const WIDGET_REGISTRY: Record<string, () => Promise<Type<unknown>>> = {
  stats: () =>
    import('../examples/m08-advanced-routing/l03-dynamic-components/widgets/stats-widget').then((m) => m.StatsWidget),
  'next-session': () =>
    import('../examples/m08-advanced-routing/l03-dynamic-components/widgets/next-session-widget').then(
      (m) => m.NextSessionWidget,
    ),
  favorites: () =>
    import('../examples/m08-advanced-routing/l03-dynamic-components/widgets/favorites-widget').then(
      (m) => m.FavoritesWidget,
    ),
};

function loadWidget(type: string): Promise<Type<unknown>> {
  const fallback = () =>
    import('../examples/m08-advanced-routing/l03-dynamic-components/widgets/unknown-widget').then((m) => m.UnknownWidget);
  return (WIDGET_REGISTRY[type] ?? fallback)();
}
```

## Aufgaben 3 und 4: Laden und Rendern

```ts
// src/app/playground/playground.ts (vollständig)
import { NgComponentOutlet } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, Type, resource } from '@angular/core';

interface WidgetConfig {
  type: string;
  inputs?: Record<string, unknown>;
}

interface DashboardConfig {
  title: string;
  widgets: WidgetConfig[];
}

const WIDGET_REGISTRY: Record<string, () => Promise<Type<unknown>>> = {
  stats: () =>
    import('../examples/m08-advanced-routing/l03-dynamic-components/widgets/stats-widget').then((m) => m.StatsWidget),
  'next-session': () =>
    import('../examples/m08-advanced-routing/l03-dynamic-components/widgets/next-session-widget').then(
      (m) => m.NextSessionWidget,
    ),
  favorites: () =>
    import('../examples/m08-advanced-routing/l03-dynamic-components/widgets/favorites-widget').then(
      (m) => m.FavoritesWidget,
    ),
};

function loadWidget(type: string): Promise<Type<unknown>> {
  const fallback = () =>
    import('../examples/m08-advanced-routing/l03-dynamic-components/widgets/unknown-widget').then((m) => m.UnknownWidget);
  return (WIDGET_REGISTRY[type] ?? fallback)();
}

@Component({
  selector: 'app-playground',
  imports: [NgComponentOutlet],
  template: `
    @if (config.hasValue()) {
      <h1>{{ config.value().title }}</h1>
      <div class="grid">
        @for (w of widgets.value() ?? []; track $index) {
          <section class="card">
            <ng-container *ngComponentOutlet="w.component; inputs: w.inputs" />
          </section>
        }
      </div>
    } @else if (config.error()) {
      <p class="error">Konfiguration nicht gefunden.</p>
    } @else {
      <p class="loading">Lade Konfiguration …</p>
    }
  `,
})
export class Playground {
  protected readonly config = httpResource<DashboardConfig>(() => '/playground-dashboard.json');

  protected readonly widgets = resource({
    // undefined, solange die Konfiguration lädt: resource wartet dann
    params: () => (this.config.hasValue() ? this.config.value().widgets : undefined),
    loader: ({ params }) =>
      Promise.all(params.map(async (w) => ({ component: await loadWidget(w.type), inputs: w.inputs ?? {} }))),
  });
}
```

| Entscheidung | Grund |
| --- | --- |
| `resource()` statt `effect` + `signal` | asynchrones Laden mit Lade- und Fehlerzustand, ohne manuelles `subscribe` (Lab 6.2) |
| `params` liefert `undefined` | `resource` ruft den Loader erst auf, wenn die Konfiguration da ist |
| `track $index` | Einträge haben keine ID; derselbe Typ darf mehrfach vorkommen |

## Aufgabe 5: Chunks im Network-Tab

Nach dem Neuladen erscheinen drei zusätzliche JS-Dateien, je eine für `stats-widget`, `next-session-widget` und `favorites-widget`. `unknown-widget` lädt nur, wenn ein unbekannter Typ vorkommt.

## Aufgabe 6: Aufbau nur über JSON ändern

```json
{
  "title": "Mein EventHub-Dashboard",
  "widgets": [
    { "type": "favorites", "inputs": { "sessionIds": [3, 6, 7, 11] } },
    { "type": "next-session", "inputs": { "track": "Security" } },
    { "type": "stats", "inputs": { "title": "Auslastung gesamt" } }
  ]
}
```

Ergebnis: Favoriten (4) stehen vorn, „Nächste Session · Security“ zeigt „Sichere Angular-Apps: XSS, CSRF und Tokens“ (10.03., 16:30), Statistik am Ende. Kein TypeScript-Code wurde geändert.

## Aufgabe 7: Fehlerfälle

| Eintrag | Anzeige | Konsole |
| --- | --- | --- |
| `{ "type": "chart" }` | Karte „Unbekannter Widget-Typ – Eintrag in der Konfiguration prüfen.“ | nichts |
| `{ "type": "stats", "inputs": { "titel": "X" } }` | Statistik mit Standardtitel „Statistik“ | `NG0303: Can't set value of the 'titel' input on the '_StatsWidget' component. …` |

Die Input-Namen sind der Vertrag zwischen JSON und Widget; ein Schema oder eine Prüfung beim Laden der Konfiguration fängt solche Fehler früher ab.

## Erweiterung

ViewContainerRef-Variante: siehe `src/app/examples/m08-advanced-routing/l03-dynamic-components/example-vcr.ts`.

Drag-and-drop mit nativen Events:

```ts
protected readonly order = linkedSignal(() => this.widgets.value() ?? []);
protected dragIndex = -1; // nicht private: das Template schreibt den Wert

drop(target: number): void {
  const list = [...this.order()];
  const [moved] = list.splice(this.dragIndex, 1);
  list.splice(target, 0, moved);
  this.order.set(list);
}
```

```html
@for (w of order(); track $index; let i = $index) {
  <section class="card" draggable="true" (dragstart)="dragIndex = i" (dragover)="$event.preventDefault()" (drop)="drop(i)">
    <ng-container *ngComponentOutlet="w.component; inputs: w.inputs" />
  </section>
}
```

`linkedSignal` (Lab 6.1) übernimmt die geladene Liste und bleibt danach beschreibbar.
