# Transferprojekt „EventHub Release“ – Übung

**Dauer:** ca. 240 Minuten (Teams à 2–3 Personen; 5-Tage-Variante, Tag 5)
**Ändert die EventHub-Projektbasis?** Ja — neues Feature „Warteliste“ im Kurs-Projekt `project/` mit Tests, Pipeline und optional Container.

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm run api`.
- Terminal 2 im Ordner `project/`: `npm start`.
- Eigenes Git-Repo (Fork oder Kopie des Kurs-Repos) mit der Pipeline aus Lab 14.1 unter `.github/workflows/ci.yml`.
- Arbeitsordner für das Feature: `src/app/features/waitlist/` (neu anlegen). Routen-Eintrag in `src/app/app.routes.ts`.
- Die Mock-API kennt keine eigene Wartelisten-Route. Ein Wartelisten-Eintrag ist eine Anmeldung mit `tickets: 0` und dem zusätzlichen Feld `waitlistSessionId`: `POST http://localhost:3000/registrations`. Die API speichert zusätzliche Felder unverändert.
- Ausgebuchte Session zum Testen: Session 6 („Login richtig gemacht“, 20 von 20 Plätzen); nicht ausgebucht ist z. B. Session 1.

## User Story

> Als Teilnehmerin oder Teilnehmer einer ausgebuchten Session möchte ich mich auf eine Warteliste setzen, damit ich bei einem frei werdenden Platz nachrücken kann.

Akzeptanzkriterien:

1. Die Seite `/waitlist/:sessionId` wird lazy geladen und ist nur für ausgebuchte Sessions erreichbar; sonst führt sie zurück zur Session-Liste oder Startseite.
2. Ein Formular nimmt Name und E-Mail auf; eine E-Mail darf für dieselbe Session nur einmal auf der Warteliste stehen.
3. Ein Doppelklick auf „Auf die Warteliste“ erzeugt genau einen Eintrag.
4. Fehler der API erscheinen als verständliche Meldung, das Formular bleibt nutzbar.
5. Ohne Netz zeigt die App einen Offline-Hinweis; das Programm bleibt offline lesbar.
6. Pipeline grün: Unit-Tests, Marble-Test, E2E-Test, Build mit Budgets.

## Aufgaben

### Block 1: Planung (20 Minuten)

1. Zerlege die Story in Aufgaben und verteile sie im Team. Lege für jede Aufgabe fest, welches Lab das Werkzeug liefert.
2. Lege ein Branch-Schema fest (z. B. ein Branch pro Aufgabe, Pull Request gegen `main`) und richte bei Bedarf Required Checks ein (Lab 14.1).

### Block 2: State und Datenfluss (50 Minuten)

3. Lege `waitlist.events.ts` mit einer Ereignisgruppe für die Seite (`joinRequested`) und einer für die API (`joined`, `joinFailed`) an (Lab 7.5).
4. Schreibe die Funktion `joinWaitlist(requests$, post)`, die Anfragen mit `exhaustMap` in API-Ereignisse umwandelt und Fehler in `joinFailed` übersetzt (Lab 5.2).
5. Baue `WaitlistStore` als Signal Store mit `withState`, `withComputed` (Anzahl), `withReducer` und `withEventHandlers`, der `joinWaitlist` verwendet (Lab 7.4, 7.5).
6. Schreibe einen Marble-Test für `joinWaitlist`: Doppelklick ergibt eine Anfrage, HTTP-Fehler ergibt `joinFailed` (Lab 10.3).
7. Schreibe einen Store-Test mit `HttpTestingController`: erfolgreicher Eintrag und Fehlerfall (Lab 10.4).

**Checkpoint nach Block 2:** `npx ng test --watch=false --include "src/app/features/waitlist/**/*.spec.ts"` ist grün.

### Block 3: Route, Guard, Formular (50 Minuten)

8. Schreibe den funktionalen Guard `sessionFullGuard`, der die Session lädt und nur bei `booked >= capacity` `true` liefert, sonst einen `UrlTree` (Lab 9.2).
9. Ergänze in `src/app/app.routes.ts` die Route `waitlist/:sessionId` mit `loadComponent`, `canActivate` und `providers: [WaitlistStore]` (Lab 8.1).
10. Baue `WaitlistPage` mit typisiertem Reactive Form (Name, E-Mail) und dem eigenen Validator `notOnWaitlist`, der die Einträge des Stores liest (Lab 4.1, 4.2). Der Absenden-Button dispatcht `joinRequested` über `injectDispatch`.
11. Zeige Session-Titel, Auslastung, Anzahl auf der Warteliste, Fehlermeldung und die eigenen Einträge an. Setze `data-cy`-Attribute für den E2E-Test.

### Block 4: Wiederverwendung und Offline (40 Minuten)

12. Ergänze die Library `eventhub-ui` in `workspaces/eventhub-ui-lib/` (Lab 11.2) um eine Komponente `WaitlistBadge` (Eingabe: Anzahl) und exportiere sie in `public-api.ts`. Erhöhe die Version, baue und packe die Library (`npm pack`), installiere den Tarball im Kurs-Projekt und nutze die Komponente in `WaitlistPage`. Kürzere Variante: vorhandene `SessionBadge` verwenden.
13. Zeige einen Offline-Hinweis über ein Signal aus den Browser-Ereignissen `online`/`offline` (Lab 6.2: `toSignal`).
14. Mache das Programm offline lesbar: `ng add @angular/pwa` im Kurs-Projekt, danach eine Data Group für `http://localhost:3000/sessions` in `ngsw-config.json` mit Strategie `freshness` (Lab 12.3, Vorlage `workspaces/eventhub-pwa-final/ngsw-config.json`). Prüfe im Produktions-Build mit DevTools „Offline“.

### Block 5: E2E und Pipeline (50 Minuten)

15. Schreibe `cypress/e2e/waitlist.cy.ts`: (a) Session 6 aufrufen, Formular ausfüllen, Eintrag erscheint; (b) API-Fehler per `cy.intercept` mit Status 500, Fehlermeldung erscheint; (c) Session 1 aufrufen, Weiterleitung prüfen (Lab 10.5).
16. Pushe den Branch, öffne einen Pull Request und bringe alle Jobs der Pipeline auf grün. Notiere die Budgets-Ausgabe des Builds (Lab 13.2, 14.1).

### Block 6: Abnahme (30 Minuten)

17. Prüfe die Akzeptanzkriterien 1–6 einzeln und notiere für jedes den Beleg (Test, Screenshot, Pipeline-Lauf).
18. Stelle das Feature in 5 Minuten vor: Story, Architektur (Diagramm Seite → Ereignis → Store → API), Tests, was bewusst offen bleibt.

## Checkpoint

- Nach Block 2: Marble- und Store-Tests grün.
- Nach Block 3: `/waitlist/6` zeigt das Formular, `/waitlist/1` leitet weiter; ein Eintrag erscheint nach dem Absenden.
- Nach Block 5: Pipeline im Pull Request grün.

## Abschlusskriterien

- Feature „Warteliste“ erfüllt die Akzeptanzkriterien 1–6, jedes mit Beleg.
- Mindestens ein Marble-Test, ein Store-Test und ein E2E-Test mit Fehlerfall.
- Pull Request mit grüner Pipeline.

## Erweiterung

- **Container:** Baue das Kurs-Projekt als Image (`docker build -f workspaces/docker/Dockerfile.project -t eventhub-kurs .` im Ordner `project/`) und prüfe `/waitlist/6` als Deep-Link im Container (Lab 13.3).
- **Performance:** Miss die Seite `/waitlist/6` mit Lighthouse und prüfe, dass der Chunk der Seite unter Lazy chunk files steht (Lab 13.1).
- **Nachrücken:** Admin-Ansicht, die für eine Session die Warteliste zeigt und einen Eintrag per Ereignis „promoted“ in eine Anmeldung umwandelt.

## Fallback

- Fällt ein Teammitglied aus: Block 4 auf den Offline-Hinweis (Aufgabe 13) beschränken.
- Funktioniert die Pipeline auf GitHub nicht (Netz, Rechte): Befehle der Pipeline lokal nacheinander ausführen und Exit-Codes notieren (Fallback aus Lab 14.1).
- Referenz für den Kern (Store, Ereignisse, Validator, Guard, Seite, Marble- und Store-Test): `src/app/examples/m14-ci-transfer/transfer/`, erreichbar unter `/examples/m14-ci-transfer/transfer/waitlist/6`.
