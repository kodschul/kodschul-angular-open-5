# Lab 7.1 – Lösung: Welcher State gehört wohin?

Die Referenz steht als Seite unter `src/app/examples/m07-ngrx/l01-state-decision/example.ts`, im Browser unter `/examples/m07-ngrx/l01-state-decision`. Abweichungen sind richtig, wenn die Begründung trägt.

## Aufgabe 1–4: Ausgefüllte Tabelle

| # | Zustand | Art | Ort | Begründung |
| - | ------- | --- | --- | ---------- |
| 1 | Dropdown „Track-Filter“ ist geöffnet | UI | Komponente | Interessiert nur diese Komponente, verschwindet mit ihr, muss nichts überleben. |
| 2 | Suchbegriff der Session-Suche | URL | URL | Link teilen, Lesezeichen und Zurück-Button sollen die Suche wiederherstellen. |
| 3 | Eingaben im Anmeldeformular vor dem Absenden | Formular | Formular | Gehört zum Formularmodell mit Validierung und `dirty`/`touched`; erst das abgeschickte Ergebnis wird geteilt. |
| 4 | Eingeloggte Person | globaler App-Zustand | Service mit Signals | Ein Wert, von vielen gelesen, wenig Logik; ein Auth-Service mit Signal reicht. |
| 5 | Session-Liste vom Server | Server-Cache | Signal Store | Laden, Fehler, Ladezustand und eine Sammlung für mehrere Seiten; als Feature-Store an einer Stelle testbar. |
| 6 | Favoriten der Person | globaler App-Zustand | Signal Store | Karte, Header und Favoritenseite lesen mit; Speichern ist ein Seiteneffekt mit eigenem Lade- und Fehlerzustand. |
| 7 | Warenkorb mit Workshop-Tickets | globaler App-Zustand | Signal Store | Summe und Rabatt sind abgeleitet, der Warenkorb reagiert auf Absagen und muss gespeichert werden (Reload überleben heißt speichern, nicht URL). |
| 8 | Admin: Session-Änderungen mehrerer Teams mit Protokoll | globaler App-Zustand | NgRx Store | Jede Änderung ist eine Action mit Namen, Redux DevTools zeigen den Verlauf, feste Konventionen für viele Teams. |

Verteilung: Komponente 1, URL 1, Formular 1, Service mit Signals 1, Signal Store 3, NgRx Store 1.

## Aufgabe 5: Knappe Entscheidungen

| # | Gewählt | Zweite Option | Was den Ausschlag gibt |
| - | ------- | ------------- | ---------------------- |
| 5 | Signal Store | `httpResource` in der Komponente (Lab 6.2) | Nur eine Seite zeigt die Liste: `httpResource` reicht. Mehrere Seiten, Favoriten und Absagen hängen daran: Store. |
| 4 | Service mit Signals | Signal Store | Kommen Token-Erneuerung, Rollen und Logout-Ablauf dazu (Modul 9), lohnt sich ein Store. |
| 6 | Signal Store | Service mit Signals (Lab 6.3) | Ohne Speichern und ohne Fehleranzeige genügt der Service aus Lab 6.3. |
| 8 | NgRx Store | Signal Store mit Events (Lab 7.5) | Ist im Projekt schon NgRx Store im Einsatz, bleibt es dabei; neu und klein: Signal Store mit Events. |

## Aufgabe 6: Typische Abweichungen und ob sie tragen

- **Suchbegriff in der Komponente:** trägt, wenn die Suche nie geteilt oder neu geladen werden muss. Im EventHub sollen Links auf Suchen funktionieren, deshalb URL.
- **Session-Liste im NgRx Store:** trägt in einem großen Team mit bestehendem NgRx-Store. Für ein neues, kleines Feature ist es mehr Boilerplate als nötig.
- **Warenkorb im Service mit Signals:** trägt für die Version aus Lab 6.1. Sobald er auf Absagen reagieren und gespeichert werden soll, wächst die Logik in Richtung Store.
- **Formulareingaben im Store:** trägt nicht. Jeder Tastendruck würde globalen Zustand ändern; Validierung gehört ins Formular.

## Erweiterung

Für eigene Zustände helfen die drei Fragen aus dem Entscheidungsweg: Soll ein Link es wiederherstellen? Muss es einen Reload überleben (dann zusätzlich speichern)? Wer liest mit? Wie viel Logik hängt daran?
