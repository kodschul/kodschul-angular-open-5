// Lab 2.2: startet eine zweite, kleine Angular-App mit eigener ApplicationConfig – wie main.ts.
import { AfterViewInit, ApplicationRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { MiniApp } from './mini-app';
import { createMiniAppConfig } from './mini-app.config';

@Component({
  selector: 'app-bootstrapping-example',
  template: `
    <h1>Bootstrapping mit eigener Konfiguration</h1>
    <p class="muted">
      Diese Seite startet per <code>bootstrapApplication</code> eine zweite Angular-App. Sie erscheint erst,
      wenn <code>{{ configUrl ?? '/config.json' }}</code> geladen ist.
    </p>
    <div #host></div>
  `,
})
export class BootstrappingExample implements AfterViewInit, OnDestroy {
  /** Optional per Query-Parameter, z. B. ?configUrl=/config-fehlt.json für den Fehlerfall. */
  @Input() configUrl?: string;
  @ViewChild('host', { static: true }) private host!: ElementRef<HTMLElement>;
  private appRef?: ApplicationRef;
  private destroyed = false;

  async ngAfterViewInit(): Promise<void> {
    // Host-Element anlegen, das bootstrapApplication über den Selektor findet (wie <app-root> in index.html)
    const root = document.createElement('eventhub-mini-app');
    root.textContent = 'App startet, Konfiguration wird geladen …';
    this.host.nativeElement.append(root);
    try {
      const appRef = await bootstrapApplication(MiniApp, createMiniAppConfig(this.configUrl));
      if (this.destroyed) appRef.destroy();
      else this.appRef = appRef;
    } catch (error) {
      root.textContent = `App nicht gestartet: ${(error as { message?: string }).message ?? error}`;
      root.className = 'error';
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.appRef?.destroy(); // Mini-App beim Verlassen der Seite beenden
  }
}
