# Lab 12.2 – Übung: Micro-Frontend mit Native Federation

**Dauer:** ca. 27 Minuten (inkl. 5 Minuten Debrief)
**Ändert die EventHub-Projektbasis?** Nein — die Übung arbeitet in `project/workspaces/federation-admin/` (Remote) und `project/workspaces/federation-host/` (Host).

## Vorbereitung

- Kurs-App (`npm start`, Port 4200) beenden: Der Host nutzt Port 4200.
- Läuft noch der Dev-Server aus `workspaces/eventhub-lab/` (Lab 8.1–9.3, Port 4201), ihn ebenfalls beenden: Der Remote nutzt Port 4201.
- Terminal 1 im Ordner `project/`: `npm run api` (Mock-API auf Port 3000).
- Terminal 2 im Ordner `project/workspaces/federation-admin/`: `npm install`.
- Terminal 3 im Ordner `project/workspaces/federation-host/`: `npm install`.
- Ausgangszustand: Der Remote gibt `./routes` frei, der Host lädt sie unter `/admin`.

## Aufgaben

1. Starte den Remote allein mit `npx ng serve` (Terminal 2) und öffne http://localhost:4201. Öffne zusätzlich http://localhost:4201/remoteEntry.json und notiere die Einträge unter `exposes` und die Version von `@angular/core` unter `shared`.
2. Starte den Host mit `npx ng serve` (Terminal 3) und öffne http://localhost:4200. Klicke auf „Admin (Remote)“. Prüfe im Tab „Network“ der DevTools, von welchem Port die Datei `routes-….js` kommt und ob `_angular_core…js` einmal oder zweimal geladen wird.
3. Lies im Host `public/federation.manifest.json`, `src/main.ts` und `src/app/app.routes.ts` und ordne jede Datei einem Schritt im Ablaufdiagramm der Theorie zu.
4. Ändere im Remote `ADMIN_VERSION` in `src/app/admin-dashboard.ts` auf `1.1.0` und speichere. Warte, bis Terminal 2 den Neubau meldet, und lade im Host `/admin` neu, ohne den Host anzufassen.
5. Gib im Remote in `federation.config.mjs` zusätzlich die Komponente `AdminDashboard` unter dem Schlüssel `./Dashboard` frei. Starte den Remote neu (Konfigurationsänderungen brauchen einen Neustart).
6. Ergänze im Host eine Route `auslastung`, die per `loadComponent` und `loadRemoteModule` die Komponente `./Dashboard` lädt, einen Typ für das Modul in einer `.d.ts`-Datei und einen Link „Auslastung“ in der Navigation.
7. Beende den Remote (Strg+C in Terminal 2) und öffne im Host `/admin`. Lies die Meldung in der Konsole.
8. Fange den Fehler in der Route `admin` mit `.catch()` ab und zeige stattdessen eine Komponente `RemoteUnavailable` mit dem Text „Der Admin-Bereich ist gerade nicht erreichbar.“. Prüfe mit gestopptem und wieder gestartetem Remote.

## Checkpoint

- Nach Aufgabe 1: Der Remote zeigt allein „Remote v1.0.0“ und die Auslastung; `remoteEntry.json` enthält `./routes`.
- Nach Aufgabe 2: `routes-….js` kommt von Port 4201, `_angular_core…js` wird genau einmal geladen.
- Nach Aufgabe 4: Der Host zeigt „Remote v1.1.0“; Terminal 3 meldet keinen Neubau.
- Nach Aufgabe 6: http://localhost:4200/auslastung zeigt das Dashboard ohne den Umweg über `/admin`.

## Abschlusskriterien

- Host zeigt den Admin-Remote unter `/admin` und `/auslastung`; eine Änderung am Remote ist ohne Host-Build sichtbar.
- Bei gestopptem Remote startet der Host trotzdem und zeigt unter `/admin` die Ersatzseite.

## Erweiterung

- Baue den Remote für Produktion (`npx ng build`) und starte ihn statisch: `npx http-server dist/federation-admin/browser -p 4201 --cors`. Prüfe, dass der Host weiter funktioniert.
- Lege eine zweite Manifest-Datei für eine „Testumgebung“ an, die auf einen Remote auf Port 4202 zeigt, und überlege, wie sie beim Deployment die Standarddatei ersetzt (Bezug: Laufzeitkonfiguration aus Lab 2.2).

## Fallback

- Ohne Mock-API zeigt der Remote „Mock-API nicht erreichbar“; Laden, Versionswechsel und Fehlerfall funktionieren trotzdem.
- Ist Port 4200 nicht frei zu bekommen: Host mit `npx ng serve --port 4300` starten (die Remote-URL im Manifest bleibt gleich).
- Ohne Internet für `npm install`: Workspaces mit vorinstallierten `node_modules` aus dem Kurs-ZIP nutzen.
