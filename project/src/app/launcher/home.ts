import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATALOG } from './catalog';

/** Startseite: listet Playground und alle Beispiele aus dem Katalog. */
@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <h1>EventHub – Kurs-Beispiele</h1>
    <p class="muted">
      Eigene Arbeit liegt im <a routerLink="/playground">Playground</a>. Die fertigen Beispiele dienen
      zum Vergleich nach der Übung.
    </p>

    @for (day of days; track day) {
      <h2>Tag {{ day }}</h2>
      @for (module of modulesOfDay(day); track module.code) {
        <section class="card">
          <h3>Modul {{ module.n }}: {{ module.title }}</h3>
          <ul>
            @for (lab of module.labs; track lab.code) {
              <li>
                <a [routerLink]="['/examples', module.code, lab.code]">Lab {{ lab.n }} {{ lab.title }}</a>
                @for (variant of lab.variants ?? []; track variant.path) {
                  · <a [routerLink]="['/examples', module.code, lab.code, variant.path]">{{ variant.label }}</a>
                }
              </li>
            }
          </ul>
        </section>
      }
    }
  `,
})
export class Home {
  protected readonly days = [1, 2, 3, 4];
  protected modulesOfDay(day: number) {
    return CATALOG.filter((module) => module.day === day);
  }
}
