import { Component } from '@angular/core';
import { Observable, debounceTime, filter, map, take } from 'rxjs';

// Starter Lab 5.1: Inhalt nach src/app/playground/playground.ts kopieren.

/*
  Gezeichnete Ausgabe-Diagramme (1 Zeichen = 100 ms), VOR dem Start eintragen:

  1 map          Eingabe: -1-2-3|            Ausgabe: ?
  2 filter       Eingabe: -1-2-3-4-5|        Ausgabe: ?
  3 debounceTime Eingabe: abc----de------|   Ausgabe: ?
  4 take         Eingabe: -a-b-c-d|          Ausgabe: ?
*/

const FRAME_MS = 100;

/** Gegeben: erzeugt ein Observable aus einem Marble-Diagramm ('-' = 100 ms, '|' = complete, '#' = error). */
function zeitstrahl<T = string>(diagramm: string, werte: Record<string, T> = {}): Observable<T> {
  return new Observable<T>((subscriber) => {
    const timer = [...diagramm.replaceAll(' ', '')].map((zeichen, frame) =>
      setTimeout(() => {
        if (zeichen === '-') return;
        if (zeichen === '|') subscriber.complete();
        else if (zeichen === '#') subscriber.error(new Error('Fehler im Strom'));
        else subscriber.next(zeichen in werte ? werte[zeichen] : (zeichen as T));
      }, frame * FRAME_MS),
    );
    return () => timer.forEach(clearTimeout);
  });
}

/** Gegeben: Frame-Nummer seit dem Startzeitpunkt (performance.now()). */
function frameSeit(start: number): number {
  return Math.round((performance.now() - start) / FRAME_MS);
}

@Component({
  selector: 'app-playground',
  template: `
    <h1>Lab 5.1 Marble-Diagramme prüfen</h1>
    <p class="muted">Konsole öffnen, dann starten.</p>
    <button class="btn btn-primary" (click)="start()">Ketten starten</button>
  `,
})
export class Playground {
  start(): void {
    console.clear();
    const start = performance.now();
    console.log('Start, Frame', frameSeit(start));

    // TODO Aufgabe 4: an jede Kette hinter den Operator ein tap({ next, complete }) hängen, das Name, Frame und Wert loggt
    //                 (tap oben im Import aus 'rxjs' ergänzen)

    zeitstrahl('-1-2-3|', { 1: 1, 2: 2, 3: 3 })
      .pipe(map((x) => x * 10))
      .subscribe();

    zeitstrahl('-1-2-3-4-5|', { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 })
      .pipe(filter((x) => x % 2 === 0))
      .subscribe();

    zeitstrahl('abc----de------|', { a: 'a', b: 'an', c: 'ang', d: 'angu', e: 'angul' })
      .pipe(debounceTime(300))
      .subscribe();

    zeitstrahl('-a-b-c-d|')
      .pipe(take(2))
      .subscribe();
  }
}
