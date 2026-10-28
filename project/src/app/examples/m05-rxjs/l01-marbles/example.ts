import { Component } from '@angular/core';
import { debounceTime, filter, map, take } from 'rxjs';
import { protokoll, zeitstrahl } from './timeline';

// Lab 5.1: vier Ketten, ihre Diagramme und die Prüfung per tap-Logging (Konsole öffnen).
@Component({
  selector: 'app-marbles-example',
  template: `
    <h1>Lab 5.1 Observables und Marble-Diagramme</h1>
    <p class="muted">1 Zeichen = 100 ms. „Ketten starten“ abonniert alle vier Ketten; die Ausgabe steht in der Konsole.</p>
    <button class="btn btn-primary" (click)="start()">Ketten starten</button>

    <table class="card">
      <thead>
        <tr><th>Kette</th><th>Eingabe</th><th>Operator</th><th>Ausgabe</th></tr>
      </thead>
      <tbody>
        @for (kette of ketten; track kette.name) {
          <tr>
            <td>{{ kette.name }}</td>
            <td><code>{{ kette.eingabe }}</code></td>
            <td><code>{{ kette.operator }}</code></td>
            <td><code>{{ kette.ausgabe }}</code></td>
          </tr>
        }
      </tbody>
    </table>
  `,
  styles: `
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { text-align: left; padding: 0.4rem; border-bottom: 1px solid var(--border); }
    code { font-size: 1rem; white-space: pre; }
  `,
})
export class MarblesExample {
  protected readonly ketten = [
    { name: '1 map', eingabe: '-1-2-3|', operator: 'map(x => x * 10)', ausgabe: '-a-b-c|   a=10 b=20 c=30' },
    { name: '2 filter', eingabe: '-1-2-3-4-5|', operator: 'filter(x => x % 2 === 0)', ausgabe: '---2---4--|' },
    { name: '3 debounceTime', eingabe: 'abc----de------|', operator: 'debounceTime(300)', ausgabe: '-----c-----e---|' },
    { name: '4 take', eingabe: '-a-b-c-d|', operator: 'take(2)', ausgabe: '-a-(b|)' },
  ];

  start(): void {
    console.clear();

    // 1: map verändert jeden Wert, nicht den Zeitpunkt
    zeitstrahl('-1-2-3|', { 1: 1, 2: 2, 3: 3 })
      .pipe(map((x) => x * 10), protokoll('1 map'))
      .subscribe();

    // 2: filter lässt Werte weg, die Lücken bleiben
    zeitstrahl('-1-2-3-4-5|', { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 })
      .pipe(filter((x) => x % 2 === 0), protokoll('2 filter'))
      .subscribe();

    // 3: debounceTime wartet 300 ms Ruhe ab und sendet dann den letzten Wert
    const tippen = { a: 'a', b: 'an', c: 'ang', d: 'angu', e: 'angul' };
    zeitstrahl('abc----de------|', tippen)
      .pipe(protokoll('3 eingabe'), debounceTime(300), protokoll('3 debounceTime'))
      .subscribe();

    // 4: take(2) beendet den Strom nach dem zweiten Wert
    zeitstrahl('-a-b-c-d|')
      .pipe(take(2), protokoll('4 take'))
      .subscribe();
  }
}
