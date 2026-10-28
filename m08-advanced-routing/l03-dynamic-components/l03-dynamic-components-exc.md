# Lab 8.3 – Übung: Dynamische Komponenten

**Dauer:** ca. 20 Minuten
**Ändert die EventHub-Projektbasis?** Ja — die Datei `public/playground-dashboard.json` (liegt bereit) wird angepasst; das Dashboard entsteht im Playground der Kurs-App.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api`.
- Terminal 2 im Ordner `output/project/`: `npm start`.
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m08-l03-dynamic-components.ts`
- Fertige Widgets (nicht ändern): `src/app/examples/m08-advanced-routing/l03-dynamic-components/widgets/` mit `stats-widget.ts` (Input `title`), `next-session-widget.ts` (Input `track`), `favorites-widget.ts` (Input `sessionIds`), `unknown-widget.ts` (ohne Inputs)
- Browser: http://localhost:4200/playground, DevTools mit Tab „Network“ (Filter `JS`).

## Aufgaben

1. Kopiere den Starter nach `src/app/playground/playground.ts`. Ändere im Starter die URL auf `/playground-dashboard.json` (die Datei liegt bereit, Inhalt wie `public/dashboard-widgets.json`). Die Seite zeigt Titel und „3 Widgets konfiguriert“.
2. Ergänze die Registry `WIDGET_REGISTRY` um `next-session` und `favorites`. Stelle `stats` auf `import()` um und entferne den statischen Import von `StatsWidget`.
3. Lege mit `resource()` ein Signal `widgets` an, das für jede `WidgetConfig` die Komponente über die Registry lädt und `{ component, inputs }` liefert. Unbekannte Typen laden `UnknownWidget`.
4. Rendere die Widgets im Template in einem `.grid` mit `*ngComponentOutlet` und `inputs`. Ergänze `NgComponentOutlet` in `imports`.
5. Lade die Seite neu und prüfe im Network-Tab, dass jedes Widget eine eigene JS-Datei lädt.
6. Ändere nur `public/playground-dashboard.json`: Reihenfolge der Widgets tauschen, `track` auf `"Security"` setzen, eine Session-ID bei `favorites` ergänzen. Lade neu und prüfe die Anzeige.
7. Ergänze in der JSON einen Eintrag `{ "type": "chart" }` und einen Eintrag mit falschem Input-Namen (`"titel"` statt `"title"` bei `stats`). Notiere Anzeige und Konsolenmeldung. Entferne beide Einträge wieder.

## Checkpoint

- Drei Widgets erscheinen in der Reihenfolge der JSON-Datei.
- Jedes Widget lädt als eigener Chunk.
- Nach Aufgabe 6 zeigt „Nächste Session“ eine Security-Session; der Favoriten-Zähler ist um eins gestiegen.
- Aufgabe 7: `chart` zeigt den Platzhalter „Unbekannter Widget-Typ“; `titel` erzeugt in der Konsole `NG0303: Can't set value of the 'titel' input on the '_StatsWidget' component.`

## Abschlusskriterien

- `playground.ts` enthält keinen statischen Import einer Widget-Klasse und kein `@switch` über Widget-Typen.
- Der Aufbau des Dashboards ändert sich nur über `public/playground-dashboard.json`.

## Erweiterung (optional)

- Baue eine zweite Darstellung mit `viewChild.required('host', { read: ViewContainerRef })`, `createComponent` und `setInput` (Vorlage: `example-vcr.ts` im Beispielordner).
- Reihenfolge per Drag-and-drop: Lege die geladene Liste in ein `signal`, mache jede Karte `draggable="true"` und tausche Einträge in `(dragstart)`/`(drop)` (mit `(dragover)="$event.preventDefault()"`). Alternativ Buttons „hoch“ und „runter“.

## Fallback

- Fertiges Beispiel: http://localhost:4200/examples/m08-advanced-routing/l03-dynamic-components (Variante `…/vcr` mit `ViewContainerRef`).
- Wird `/playground-dashboard.json` nicht gefunden (Fehlertext „Konfiguration nicht gefunden“): Datei in `public/` und URL im Starter prüfen. Eine neu angelegte Datei in `public/` liefert der Dev-Server erst nach einem Neustart von `npm start` aus.
