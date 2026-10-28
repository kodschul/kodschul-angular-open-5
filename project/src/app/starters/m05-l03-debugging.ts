import { Component, OnInit } from '@angular/core';
import { MonoTypeOperatorFunction, interval, tap } from 'rxjs';

// Starter Lab 5.3: Inhalt nach src/app/playground/playground.ts kopieren.
// Die Komponente enthält ein Speicherleck. Finden, im Log nachweisen, beheben.

const aktiveAbos = new Map<string, number>();

/** Gegeben: benanntes Debug-Logging mit Zähler aktiver Abos. */
function debug<T>(name: string): MonoTypeOperatorFunction<T> {
  const zaehlen = (delta: number) => {
    const anzahl = (aktiveAbos.get(name) ?? 0) + delta;
    aktiveAbos.set(name, anzahl);
    return anzahl;
  };
  return tap({
    subscribe: () => console.log(`[${name}] subscribe – aktiv: ${zaehlen(+1)}`),
    next: (wert) => console.log(`[${name}] next:`, wert),
    finalize: () => console.log(`[${name}] beendet – aktiv: ${zaehlen(-1)}`),
  });
}

@Component({
  selector: 'app-playground',
  template: `
    <h1>Lab 5.3 Entwurf automatisch speichern</h1>
    <p>Speichert jede Sekunde einen Entwurf (simuliert in der Konsole).</p>
    <p class="muted">Danach über „Beispiele“ in der Kopfzeile die Seite verlassen und die Konsole beobachten.</p>
  `,
})
export class Playground implements OnInit {
  ngOnInit(): void {
    interval(1000).subscribe((n) => console.log('Entwurf gespeichert', n));
  }
}
