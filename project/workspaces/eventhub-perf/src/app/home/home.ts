import { Component } from '@angular/core';
import { BookingChart } from '../stats/booking-chart';
import { SessionList } from '../sessions/session-list';

// Startseite der langsamen Variante. Befund 1: Hero-Bild ohne Abmessungen, 4–5 MB groß.
// Befund 2: BookingChart (Chart.js) wird sofort mit der Startseite geladen.
@Component({
  selector: 'app-home',
  imports: [SessionList, BookingChart],
  template: `
    <img src="img/hero.png" alt="Bühne der EventHub-Konferenz mit drei Scheinwerfern" class="hero" />
    <section class="hero-text">
      <h1>EventHub Konferenz 2027</h1>
      <p class="muted">Drei Tage Angular, Architektur und Testing. Programm, Speaker und Anmeldung an einem Ort.</p>
    </section>

    <h2>Programm</h2>
    <app-session-list />

    <h2>Auslastung</h2>
    <app-booking-chart />
  `,
  styles: `
    .hero { display: block; width: 100%; height: auto; border-radius: 8px; }
  `,
})
export class Home {}
