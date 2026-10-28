import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { BookingChart } from '../stats/booking-chart';
import { SessionList } from '../sessions/session-list';

// Startseite nach Lab 13.2.
// Fix 1: Hero-Bild mit NgOptimizedImage, festen Abmessungen und priority (LCP, CLS), Datei 1400 x 700 statt 2400 x 1200;
//        Platzhalter mit fester Höhe für Liste und Diagramm (CLS).
// Fix 2: BookingChart (Chart.js) per @defer in einen eigenen Chunk, geladen erst bei Sichtbarkeit.
@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, SessionList, BookingChart],
  template: `
    <img
      ngSrc="img/hero.png"
      width="1400"
      height="700"
      priority
      alt="Bühne der EventHub-Konferenz mit drei Scheinwerfern"
      class="hero"
    />
    <section class="hero-text">
      <h1>EventHub Konferenz 2027</h1>
      <p class="muted">Drei Tage Angular, Architektur und Testing. Programm, Speaker und Anmeldung an einem Ort.</p>
    </section>

    <h2>Programm</h2>
    <app-session-list />

    <h2>Auslastung</h2>
    @defer (on viewport; prefetch on idle) {
      <app-booking-chart />
    } @placeholder {
      <div class="card"><div class="chart-placeholder muted">Diagramm wird beim Scrollen geladen …</div></div>
    } @loading (minimum 200ms) {
      <div class="card"><div class="chart-placeholder loading">Diagramm wird geladen …</div></div>
    }
  `,
  styles: `
    .hero { display: block; width: 100%; height: auto; border-radius: 8px; }
    .chart-placeholder { height: 320px; } /* gleiche Höhe wie das Diagramm: kein Layout-Sprung */
  `,
})
export class Home {}
