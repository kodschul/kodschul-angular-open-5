# Lab 3.3 – Lösung: Standalone Directives und Host Directives

Referenz: `src/app/examples/m03-component-deep-dive/l03-directives/` (`highlight.directive.ts`, `tooltip.directive.ts`, `session-badge.ts`, `example.ts`), im Browser `/examples/m03-component-deep-dive/l03-directives`. Im Playground stehen alle Klassen in einer Datei; im Beispiel hat jede ihre eigene Datei.

## Aufgabe 1: Starter kopieren

Die Liste zeigt zwölf Sessions mit farbigem Level-Badge, noch ohne Hover und Tooltip.

## Aufgabe 2: `Highlight`

Import-Zeile erweitern und Direktive an der Stelle `TODO Aufgabe 2` einfügen:

```ts
import { Component, Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';
import { SessionLevel } from '../shared/models';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'active = true',
    '(mouseleave)': 'active = false',
    '[style.backgroundColor]': 'active ? (color || defaultColor) : null',
  },
})
export class Highlight {
  @Input('appHighlight') color = '';
  readonly defaultColor = '#fff3c4';
  active = false;
}
```

`@Input('appHighlight')` macht den Selektor gleichzeitig zur Eingabe: `appHighlight="#eef3ff"` setzt `color`, ein leeres `appHighlight` lässt `color` bei `''`.

## Aufgabe 3: Highlight verwenden

```ts
imports: [AsyncPipe, Highlight],
```

```html
<h1 appHighlight>Sessions</h1>
…
<div class="card" appHighlight="#eef3ff">
```

## Aufgabe 4: `Tooltip`

```ts
@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '[style.position]': '"relative"',
  },
})
export class Tooltip {
  @Input('appTooltip') text = '';

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private bubble: HTMLElement | null = null;

  show(): void {
    if (!this.text || this.bubble) return;
    this.bubble = createBubble(this.renderer, this.text);
    this.renderer.appendChild(this.host.nativeElement, this.bubble);
  }

  hide(): void {
    if (!this.bubble) return;
    this.renderer.removeChild(this.host.nativeElement, this.bubble);
    this.bubble = null;
  }
}
```

`'"relative"'` ist ein String-Literal im Ausdruck; ohne die inneren Anführungszeichen sucht Angular ein Feld `relative`.

## Aufgabe 5: Tooltip verwenden

```ts
imports: [AsyncPipe, Highlight, Tooltip],
```

```html
<h1 appHighlight appTooltip="Alle Sessions der EventHub-Konferenz">Sessions</h1>
```

## Aufgaben 6 und 7: `SessionBadge`

```ts
@Component({
  selector: 'app-session-badge',
  hostDirectives: [
    { directive: Highlight, inputs: ['appHighlight: color'] },
    { directive: Tooltip, inputs: ['appTooltip: tooltip'] },
  ],
  host: {
    class: 'badge',
    '[class.badge-ok]': "level === 'Einsteiger'",
    '[class.badge-warn]': "level === 'Fortgeschritten'",
    '[class.badge-error]': "level === 'Experte'",
  },
  template: `{{ level }}`,
})
export class SessionBadge {
  @Input() level: SessionLevel = 'Einsteiger';
}
```

Die Klasse muss im Code vor `Playground` stehen, damit `imports: [..., SessionBadge]` sie findet.

## Aufgabe 8: Badge einsetzen

```ts
imports: [AsyncPipe, Highlight, Tooltip, SessionBadge],
```

```html
<div class="card" appHighlight="#eef3ff">
  <div class="row">
    <strong>{{ session.title }}</strong>
    <app-session-badge
      [level]="session.level"
      color="#ffe08a"
      [tooltip]="session.track + ' · ' + session.room"
    />
  </div>
</div>
```

## Aufgabe 9: Prüfen

- Hover über das Badge der ersten Session: gelber Hintergrund, Tooltip „Frontend · Saal A“. Die Karte darunter wird gleichzeitig hellblau, weil beide Elemente eigene `Highlight`-Instanzen haben.
- Ohne `inputs: ['appTooltip: tooltip']` meldet der Compiler `Can't bind to 'tooltip' since it isn't a known property of 'app-session-badge'`. Die Eingabe der Host Directive ist ohne Freigabe von außen nicht erreichbar.
- Ohne `inputs: ['appHighlight: color']` gibt es dagegen keinen Fehler: `color="#ffe08a"` ohne eckige Klammern ist dann nur ein HTML-Attribut, und das Badge nutzt die Standardfarbe.

## Erweiterung: Tastatur-Fokus

```ts
let nextTooltipId = 0;

@Directive({
  selector: '[appTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
    '[style.position]': '"relative"',
    '[attr.aria-describedby]': 'bubble ? bubbleId : null',
  },
})
export class Tooltip {
  @Input('appTooltip') text = '';

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  readonly bubbleId = `tooltip-${nextTooltipId++}`;
  bubble: HTMLElement | null = null; // öffentlich, weil host-Bindung es liest

  show(): void {
    if (!this.text || this.bubble) return;
    this.bubble = createBubble(this.renderer, this.text);
    this.renderer.setAttribute(this.bubble, 'id', this.bubbleId);
    this.renderer.appendChild(this.host.nativeElement, this.bubble);
  }

  hide(): void {
    if (!this.bubble) return;
    this.renderer.removeChild(this.host.nativeElement, this.bubble);
    this.bubble = null;
  }
}
```

In `SessionBadge` zusätzlich `tabindex: '0'` in `host`. Mit der Tab-Taste springt der Fokus von Badge zu Badge, der Tooltip erscheint und ein Screenreader liest ihn über `aria-describedby` vor.
