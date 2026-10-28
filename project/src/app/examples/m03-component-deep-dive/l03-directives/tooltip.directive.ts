import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';

// Attribut-Direktive: zeigt beim Hover eine Tooltip-Blase am Host-Element.
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

// DOM-Arbeit über Renderer2 statt document.createElement (funktioniert auch beim Server-Rendering)
function createBubble(renderer: Renderer2, text: string): HTMLElement {
  const bubble: HTMLElement = renderer.createElement('span');
  renderer.setAttribute(bubble, 'role', 'tooltip');
  renderer.appendChild(bubble, renderer.createText(text));
  const styles: Record<string, string> = {
    position: 'absolute',
    bottom: '125%',
    left: '0',
    padding: '0.3rem 0.6rem',
    background: '#1d2330',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    zIndex: '10',
  };
  for (const [name, value] of Object.entries(styles)) renderer.setStyle(bubble, name, value);
  return bubble;
}
