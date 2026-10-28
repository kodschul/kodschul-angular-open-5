import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { debug } from './debug';

// Drei Wege, ein Abo mit der Komponente zu beenden.
@Component({
  selector: 'app-fixed-ticker',
  imports: [AsyncPipe],
  template: `
    <h2>Ticker aufgeräumt</h2>
    <p>Wert per async-Pipe: <strong>{{ tick$ | async }}</strong></p>
    <p class="muted">Nach dem Verlassen der Route meldet die Konsole für alle drei Abos „beendet – aktiv: 0“.</p>
  `,
})
export class FixedTicker implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // 1. async-Pipe: abonniert beim Anzeigen, beendet beim Zerstören der Komponente
  protected readonly tick$ = interval(1000).pipe(debug('ticker-async'));

  constructor() {
    // 2. takeUntilDestroyed() im Injection Context (Konstruktor, Feld-Initialisierung)
    interval(1000)
      .pipe(debug('ticker-takeUntilDestroyed'), takeUntilDestroyed())
      .subscribe();
  }

  ngOnInit(): void {
    // 3. Außerhalb des Injection Context: DestroyRef vorher per inject() holen und übergeben
    interval(1000)
      .pipe(debug('ticker-destroyRef'), takeUntilDestroyed(this.destroyRef))
      .subscribe();

    // DestroyRef kann auch beliebigen Aufräumcode registrieren
    this.destroyRef.onDestroy(() => console.log('FixedTicker zerstört'));
  }
}
