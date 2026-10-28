// Lab 7.1: Referenz-Entscheidungstabelle „Welcher State gehört wohin?“ (Denkübung, kein Code-Ergebnis).
// Die Seite zeigt die begründete Einordnung aus l01-state-decision-sol.md.
import { Component, computed, signal } from '@angular/core';

type Ort = 'Komponente' | 'URL' | 'Formular' | 'Service mit Signals' | 'Signal Store' | 'NgRx Store';

interface Zustand {
  nr: number;
  zustand: string;
  art: string;
  ort: Ort;
  begruendung: string;
}

const TABELLE: Zustand[] = [
  { nr: 1, zustand: 'Dropdown „Track-Filter“ ist geöffnet', art: 'UI', ort: 'Komponente',
    begruendung: 'Interessiert nur diese Komponente, verschwindet mit ihr, muss nicht überleben.' },
  { nr: 2, zustand: 'Suchbegriff der Session-Suche', art: 'URL', ort: 'URL',
    begruendung: 'Link teilen, Lesezeichen und Zurück-Button sollen die Suche wiederherstellen.' },
  { nr: 3, zustand: 'Eingaben im Anmeldeformular vor dem Absenden', art: 'Formular', ort: 'Formular',
    begruendung: 'Gehört zum Formularmodell (Validierung, dirty/touched); erst das Ergebnis wird geteilt.' },
  { nr: 4, zustand: 'Eingeloggte Person', art: 'globaler App-Zustand', ort: 'Service mit Signals',
    begruendung: 'Ein Wert, von vielen gelesen, wenig Logik; ein AuthService mit Signal reicht.' },
  { nr: 5, zustand: 'Session-Liste vom Server', art: 'Server-Cache', ort: 'Signal Store',
    begruendung: 'Laden, Fehler, Ladezustand und Entities für mehrere Seiten; als Feature-Store gut testbar.' },
  { nr: 6, zustand: 'Favoriten der Person', art: 'globaler App-Zustand', ort: 'Signal Store',
    begruendung: 'Header, Karte und Favoritenseite lesen mit; Speichern ist ein Seiteneffekt.' },
  { nr: 7, zustand: 'Warenkorb mit Workshop-Tickets', art: 'globaler App-Zustand', ort: 'Signal Store',
    begruendung: 'Summe und Rabatt abgeleitet, reagiert auf Absagen, muss beim Reload erhalten bleiben.' },
  { nr: 8, zustand: 'Admin: Session-Änderungen mehrerer Teams mit Protokoll', art: 'globaler App-Zustand', ort: 'NgRx Store',
    begruendung: 'Jede Änderung als Action nachvollziehbar, Redux DevTools, feste Konventionen für viele Teams.' },
];

@Component({
  selector: 'app-state-decision-example',
  template: `
    <h1>Lab 7.1: Welcher State gehört wohin?</h1>
    <p class="muted">Referenzlösung. Abweichungen sind möglich, wenn die Begründung trägt.</p>

    <label class="row">
      <input type="checkbox" [checked]="mitBegruendung()" (change)="mitBegruendung.set(box.checked)" #box />
      Begründung anzeigen
    </label>

    <table class="card">
      <thead>
        <tr><th>#</th><th>Zustand</th><th>Art</th><th>Ort</th>@if (mitBegruendung()) {<th>Begründung</th>}</tr>
      </thead>
      <tbody>
        @for (eintrag of tabelle; track eintrag.nr) {
          <tr>
            <td>{{ eintrag.nr }}</td>
            <td>{{ eintrag.zustand }}</td>
            <td>{{ eintrag.art }}</td>
            <td><span class="badge">{{ eintrag.ort }}</span></td>
            @if (mitBegruendung()) {<td class="muted">{{ eintrag.begruendung }}</td>}
          </tr>
        }
      </tbody>
    </table>

    <h2>Verteilung</h2>
    <ul>
      @for (zeile of verteilung(); track zeile.ort) {
        <li>{{ zeile.ort }}: {{ zeile.anzahl }}</li>
      }
    </ul>
  `,
  styles: `
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.4rem; border-bottom: 1px solid var(--border); vertical-align: top; }
  `,
})
export class StateDecisionExample {
  readonly tabelle = TABELLE;
  readonly mitBegruendung = signal(true);

  // Zählung je Ort: abgeleiteter Wert, deshalb computed (Lab 6.1)
  readonly verteilung = computed(() => {
    const orte: Ort[] = ['Komponente', 'URL', 'Formular', 'Service mit Signals', 'Signal Store', 'NgRx Store'];
    return orte.map((ort) => ({ ort, anzahl: this.tabelle.filter((z) => z.ort === ort).length }));
  });
}
