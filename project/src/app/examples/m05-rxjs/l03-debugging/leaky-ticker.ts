import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { debug } from './debug';

// Fehlerbild: subscribe ohne Ende. Nach dem Verlassen der Route läuft das Intervall weiter.
@Component({
  selector: 'app-leaky-ticker',
  template: `
    <h2>Ticker mit Leck</h2>
    <p>Sendet jede Sekunde einen Wert in die Konsole. Danach „Andere Seite“ öffnen und die Konsole beobachten.</p>
  `,
})
export class LeakyTicker implements OnInit {
  ngOnInit(): void {
    interval(1000)
      .pipe(debug('ticker-leck'))
      .subscribe((n) => console.log('Leck-Ticker speichert Entwurf', n));
  }
}
