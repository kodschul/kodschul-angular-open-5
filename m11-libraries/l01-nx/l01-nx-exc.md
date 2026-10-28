# Lab 11.1 – Übung: Nx Workspace

**Dauer:** ca. 20 Minuten
**Ändert die EventHub-Projektbasis?** Nein — die Übung arbeitet im eigenen Workspace `output/project/workspaces/nx-eventhub/`.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api` (Mock-API auf Port 3000).
- Terminal 2 im Ordner `output/project/workspaces/nx-eventhub/`: `npm install` (einmalig, ca. 1 Minute).
- Ausgangszustand: App `eventhub` mit `apps/eventhub/src/app/sessions/session-list.ts` und `session-card.ts`, Library `models` (`libs/shared/models`).
- Browser: http://localhost:4210 (Dev-Server der Nx-App; die Kurs-App auf Port 4200 darf weiterlaufen).

## Aufgaben

1. Liste die Projekte mit `npx nx show projects` auf und starte die App mit `npx nx serve eventhub`. Prüfe im Browser, dass die Session-Karten erscheinen. Beende den Dev-Server danach.
2. Öffne `apps/eventhub/project.json` und `libs/shared/models/project.json` und notiere die Tags beider Projekte. Öffne `eslint.config.mjs` und suche die Regel für `type:ui`.
3. Generiere eine Angular-Library `ui` unter `libs/shared/ui` mit den Tags `type:ui,scope:shared` und dem Präfix `ui`. Führe den Befehl zuerst mit `--dry-run` aus und lies die Dateiliste.
4. Lösche den vom Generator angelegten Platzhalter `libs/shared/ui/src/lib/ui/` (Komponente `Ui`).
5. Verschiebe `session-card.ts` und `session-card.spec.ts` aus `apps/eventhub/src/app/sessions/` nach `libs/shared/ui/src/lib/session-card/`. Ändere den Selektor auf `ui-session-card`.
6. Exportiere die Karte in `libs/shared/ui/src/index.ts`. Importiere sie in `session-list.ts` über den Alias der Library und passe das Template an den neuen Selektor an.
7. Prüfe mit `npx nx build eventhub` und `npx nx serve eventhub`, dass die App die Karte aus der Library nutzt.
8. Öffne den Projektgraphen mit `npx nx graph --focus=eventhub` (zeigt `eventhub` mit allen Projekten, von denen es abhängt). Notiere die Pfeile zwischen `eventhub`, `ui` und `models` und beende den Graph-Server mit Strg+C.
9. Ändere in der Karte den Text (z. B. Raum vor Speaker) und führe `npx nx show projects --affected --files=libs/shared/ui/src/lib/session-card/session-card.ts` aus, danach dasselbe mit `--files=libs/shared/models/src/lib/models.ts`.
10. Führe `npx nx affected -t test --files=libs/shared/ui/src/lib/session-card/session-card.ts` zweimal hintereinander aus und vergleiche die letzte Zeile beider Läufe.
11. Füge in der Karte testweise `import { HttpClient } from '@angular/common/http';` und ein Feld `http = inject(HttpClient)` ein, führe `npx nx lint ui` aus und lies die Meldung. Entferne beides wieder.

## Checkpoint

- Nach Aufgabe 3: `tsconfig.base.json` enthält den Alias `@nx-eventhub/ui`, `libs/shared/ui/project.json` die Tags `type:ui` und `scope:shared`.
- Nach Aufgabe 7: Die App auf Port 4210 zeigt die Karten wie vorher; `apps/eventhub/src/app/sessions/` enthält nur noch `session-list.ts`.
- Nach Aufgabe 9: Für die Karte sind `ui` und `eventhub` betroffen, für die Modelle zusätzlich `models`.
- Nach Aufgabe 10: Der zweite Lauf meldet „Nx read the output from the cache …“.

## Abschlusskriterien

- `npx nx run-many -t build test lint` läuft ohne Fehler.
- Der Projektgraph zeigt `eventhub → ui → models` und `eventhub → models`.
- Der verbotene Import in Aufgabe 11 erzeugt einen Lint-Fehler der Regel `@nx/enforce-module-boundaries`.

## Erweiterung

- Lege eine Library `libs/sessions/data-access` mit dem Tag `type:data-access` an und verschiebe das Laden der Sessions (`httpResource`) in einen Service dieser Library. Prüfe mit `npx nx lint`, dass die App ihn importieren darf, die ui-Library aber nicht.
- Speichere den Graphen als Datei: `npx nx graph --file=graph.html` (legt zusätzlich einen Ordner `static/` an) und öffne `graph.html` im Browser.

## Fallback

- Ohne Mock-API zeigt die App den Hinweis „Mock-API nicht erreichbar“; Build, Graph, Tests und Lint funktionieren trotzdem.
- Ohne Internet für `npm install`: Workspace mit vorinstallierten `node_modules` aus dem Kurs-ZIP nutzen.
