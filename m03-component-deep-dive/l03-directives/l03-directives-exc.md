# Lab 3.3 – Übung: Standalone Directives und Host Directives

**Dauer:** ca. 27 Minuten
**Ändert die EventHub-Projektbasis?** Ja — `SessionBadge` mit Hover und Tooltip ersetzt das einfache Level-Badge der Session-Liste.

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm run api`.
- Terminal 2 im Ordner `project/`: `npm start`.
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m03-l03-directives.ts` (enthält die fertige Hilfsfunktion `createBubble` für die Tooltip-Blase)
- Browser: http://localhost:4200/playground

## Aufgaben

### Teil a: Direktiven

1. Kopiere den Inhalt des Starters nach `src/app/playground/playground.ts`. Die Session-Liste erscheint mit einfachem Level-Badge.
2. Erstelle an der Stelle `TODO Aufgabe 2` eine standalone Direktive `Highlight` mit Selektor `[appHighlight]`. Sie hat eine Eingabe mit öffentlichem Namen `appHighlight` (Feld `color`, Startwert `''`), ein Feld `active` und nutzt `host` für `mouseenter`, `mouseleave` und `style.backgroundColor`. Ohne Farbe gilt `#fff3c4`.
3. Nimm `Highlight` in `imports` auf und setze `appHighlight` auf die Überschrift und `appHighlight="#eef3ff"` auf jede Session-Karte. Prüfe beide Hover-Farben.
4. Erstelle an der Stelle `TODO Aufgabe 4` eine standalone Direktive `Tooltip` mit Selektor `[appTooltip]` und Eingabe `appTooltip` (Feld `text`). Hole `ElementRef` und `Renderer2` mit `inject()`, hänge bei `mouseenter` die Blase aus `createBubble(...)` an das Host-Element und entferne sie bei `mouseleave`. Setze per `host` `style.position` auf `relative`.
5. Nimm `Tooltip` in `imports` auf und setze `appTooltip="Alle Sessions der EventHub-Konferenz"` auf die Überschrift.

### Teil b: Komposition

6. Erstelle an der Stelle `TODO Aufgabe 6` eine Komponente `SessionBadge` (Selektor `app-session-badge`) mit `@Input() level: SessionLevel = 'Einsteiger'` und dem Template `{{ level }}`; den Typ `SessionLevel` aus `../shared/models` importieren. Übertrage die Klassen des alten `<span class="badge" …>` in die `host`-Metadaten (`class: 'badge'` plus drei `[class.badge-…]`-Bindungen).
7. Ergänze `hostDirectives`: `Highlight` mit Eingabe freigegeben als `color`, `Tooltip` mit Eingabe freigegeben als `tooltip`.
8. Ersetze in der Liste das alte `<span class="badge" …>` durch `<app-session-badge [level]="session.level" color="#ffe08a" [tooltip]="session.track + ' · ' + session.room" />` und nimm `SessionBadge` in `imports` auf.
9. Prüfe: Hover über ein Badge färbt es gelb und zeigt Track und Raum. Entferne testweise erst `inputs: ['appTooltip: tooltip']`, dann `inputs: ['appHighlight: color']`, und notiere jeweils die Reaktion von Compiler und Browser; stelle beide Zeilen wieder her.

## Checkpoint

- Nach Teil a: Überschrift wird beim Hover hellgelb und zeigt den Tooltip; Karten werden hellblau.
- Nach Teil b: Jedes Badge zeigt beim Hover eine gelbe Farbe und einen Tooltip wie „Frontend · Saal A“, ohne dass `Highlight` oder `Tooltip` als Attribut am Badge stehen.

## Abschlusskriterien

- `Highlight` und `Tooltip` nutzen `host`-Metadaten, kein `@HostBinding`/`@HostListener`.
- `SessionBadge` enthält keinen Hover- oder Tooltip-Code, nur `hostDirectives`.
- Die App baut ohne Fehler.

## Erweiterung

Mache den Tooltip per Tastatur erreichbar: Das Badge bekommt `tabindex="0"`, `Tooltip` reagiert zusätzlich auf `focus` und `blur`, die Blase bekommt eine `id`, und das Host-Element verweist per `aria-describedby` darauf, solange sie sichtbar ist. Prüfe mit der Tab-Taste.

## Fallback

Läuft die Mock-API nicht, bleibt die Liste bei „Lade Sessions …“. Teil a lässt sich trotzdem an der Überschrift prüfen.
