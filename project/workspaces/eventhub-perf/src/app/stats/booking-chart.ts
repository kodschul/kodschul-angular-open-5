import { httpResource } from '@angular/common/http';
import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { EventHubConfigService } from '../config';
import { Session } from '../session';

// Registriert alle Diagrammtypen von Chart.js: bequem, aber groß.
Chart.register(...registerables);

/** Balkendiagramm „gebucht vs. Kapazität“ – nutzt Chart.js (eine schwere Bibliothek). */
@Component({
  selector: 'app-booking-chart',
  template: `
    <div class="card">
      <div class="chart-box"><canvas #canvas aria-label="Auslastung je Session"></canvas></div>
    </div>
  `,
  styles: `
    .chart-box { position: relative; height: 320px; }
  `,
})
export class BookingChart {
  private readonly config = inject(EventHubConfigService).config;
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  readonly sessions = httpResource<Session[]>(() => `${this.config.apiUrl}/sessions`);

  constructor() {
    effect((onCleanup) => {
      if (!this.sessions.hasValue()) return;
      const list = this.sessions.value();
      const chart = new Chart(this.canvas().nativeElement, {
        type: 'bar',
        data: {
          labels: list.map((s) => `#${s.id}`),
          datasets: [
            { label: 'gebucht', data: list.map((s) => s.booked), backgroundColor: '#c3002f' },
            { label: 'Kapazität', data: list.map((s) => s.capacity), backgroundColor: '#dde1e8' },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false, animation: false },
      });
      // onCleanup läuft vor dem nächsten Durchlauf des Effekts und beim Zerstören der Komponente
      onCleanup(() => chart.destroy());
    });
  }
}
