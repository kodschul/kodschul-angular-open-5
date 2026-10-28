# FAQ

## Kurs und Setup

**Muss das eigene Projekt schon auf Angular 22 laufen?**
Nein. Lab 2.3 zeigt die Migration an einer Bestands-App; die Konzepte lassen sich in den meisten Fällen ab Angular 17 nutzen, Signal Forms und `httpResource` ab Angular 22 (Stand 28.10.2026).

**Warum zwei Terminals?**
Terminal 1 startet die Mock-API (`npm run api`, Port 3000), Terminal 2 die App (`npm start`, Port 4200). Ohne API bleiben Listen leer.

**Warum laufen manche Übungen in `project/workspaces/` statt im Playground?**
Migration, Nx, Libraries, Micro-Frontends, PWA, Performance, Docker und Themen mit eigener Root-Konfiguration (Preloading, OIDC) brauchen ein eigenes Projekt. Das `-exc.md` nennt jeweils den Ordner und die Startbefehle.

**Was tun, wenn ein Starter nicht kompiliert?**
Den Inhalt von `playground.ts` vollständig ersetzen; die Klasse heißt immer `Playground`. Bei Startern mit Ordner diesen als Unterordner nach `src/app/playground/` kopieren. Dateien mit `.broken.ts` sind absichtlich fehlerhaft (Lab 1.2).

## Modernes Angular

**Brauche ich Zone.js noch?**
Neue Apps laufen seit v21 ohne Zone.js. Bestandsprojekte können Zone.js weiter nutzen; die Umstellung lohnt sich, wenn der Zustand über Signals, `async`-Pipe oder Template-Ereignisse fließt (Lab 1.1, Lab 6.1).

**Warum aktualisiert sich die Ansicht nach `subscribe` nicht?**
In einer zoneless App mit `OnPush` erfährt Angular nichts von einer Zuweisung an ein normales Feld. Lösung: `async`-Pipe, ein Signal oder `toSignal` (Lab 1.1, Lab 6.2).

**Sind `*ngIf` und `@Input` jetzt verboten?**
Nein, sie funktionieren weiter, sind aber als veraltet markiert (Strukturdirektiven seit v20). Für neuen Code gelten `@if`/`@for` und `input()`; für Bestand gibt es Migrations-Schematics (Lab 3.1, Lab 6.3).

**Ersetzen Signals RxJS?**
Nein. Signals halten Zustand, RxJS beschreibt Ereignisse über die Zeit (Suche, Entprellung, Abbruch). Beide arbeiten über `toSignal`, `toObservable` und `rxResource` zusammen (Lab 6.2).

## State, Routing, Sicherheit

**NgRx Store oder Signal Store?**
Kleine bis mittlere Features: Signal Store. Große Apps mit vielen Teams, Redux DevTools mit Zeitreise oder viel bestehendem NgRx-Code: klassischer Store. Das Events-Plugin verbindet beide Denkweisen (Lab 7.1, Lab 7.5).

**Reicht ein Guard, um den Admin-Bereich zu schützen?**
Nein. Guards verhindern nur die Navigation im Browser. Der Server muss jede Anfrage selbst prüfen; die Mock-API antwortet deshalb mit `401` oder `403` (Lab 9.1, Lab 9.2).

**Wo speichere ich das Token?**
Jeder Ort hat Risiken: `localStorage` ist per XSS lesbar, Cookies brauchen CSRF-Schutz. Für sensible Apps ist ein Backend-for-Frontend die sicherere Variante (Lab 9.1, Lab 9.3).

## Tests und Auslieferung

**Kann ich bestehende Jasmine-Tests behalten?**
`describe`, `it` und `expect` funktionieren in Vitest gleich; Spies und einige Matcher unterscheiden sich. Angular bietet eine Migration von Karma auf Vitest (Lab 10.1).

**Cypress oder Playwright?**
Beide sind etabliert. Der Kurs nutzt Cypress; die Vergleichstabelle in Lab 10.5 hilft bei der Wahl für das eigene Team.

**Lohnen sich Micro-Frontends für unser Team?**
Nur wenn mehrere Teams unabhängig ausliefern müssen. Für ein Team reicht meist ein Monorepo mit Libraries (Lab 11.1, Lab 12.1).

**Warum bekommt die App im Container auf Unterseiten einen 404-Fehler?**
Der Webserver kennt die Angular-Routen nicht. nginx braucht einen Fallback auf `index.html` (`try_files`, Lab 13.3).
