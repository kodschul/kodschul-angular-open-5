# Lab 2.2 – Übung: Bootstrapping mit app.config.ts und app.routes.ts

**Dauer:** ca. 20 Minuten
**Ändert die EventHub-Projektbasis?** Nein — `src/app/app.config.ts` wird nur gelesen; die eigene Konfiguration entsteht für eine Mini-App im Playground.

## Vorbereitung

- Terminal 1: `npm run api`, Terminal 2: `npm start`.
- Arbeitsdatei: Ordner `src/app/playground/m02-l02-bootstrapping/` (`mini-app.config.ts`, `eventhub-config.ts`); `src/app/playground/playground.ts` bleibt unverändert.
- Starter: `src/app/starters/m02-l02-bootstrapping.ts` und Ordner `src/app/starters/m02-l02-bootstrapping/`
- URL: http://localhost:4200/playground
- Datei `public/config.json` existiert (`apiUrl`, `featureFlags.comments`).

Starter kopieren (im Ordner `project/`):

```bash
cp src/app/starters/m02-l02-bootstrapping.ts src/app/playground/playground.ts
cp -r src/app/starters/m02-l02-bootstrapping src/app/playground/
```

| Datei | Rolle | Bearbeiten? |
| --- | --- | --- |
| `playground.ts` | startet die Mini-App per `bootstrapApplication` (wie `main.ts`) | nein |
| `m02-l02-bootstrapping/mini-app.ts` | Root-Komponente `MiniApp`, zeigt Konfiguration und Sessions | nein |
| `m02-l02-bootstrapping/mini-app.config.ts` | `ApplicationConfig` der Mini-App | ja (TODO 3–4) |
| `m02-l02-bootstrapping/eventhub-config.ts` | `EventHubConfigService`, `provideEventHubConfig()` | ja (TODO 5–6) |

## Aufgaben

1. Öffne `src/app/app.config.ts` und `src/app/app.routes.ts` der Kurs-App. Notiere zu jedem Provider seine Wirkung, auch zu `provideRouter(routes, withComponentInputBinding())`, und welche Route `/playground` bedient. Die Notiz entsteht außerhalb der Datei, weil `app.config.ts` allen Beispielen gehört. Die Router-Konfiguration wird nur hier gelesen: Die Mini-App hat bewusst keinen Router, damit nur ein Router auf die Browser-URL hört.
2. Öffne `/playground` und notiere die Meldung unter der Überschrift.
3. Ergänze in `mini-app.config.ts` den HTTP-Client mit `fetch` (TODO 3).
4. Trage `provideEventHubConfig(configUrl)` ein (TODO 4).
5. Ergänze in `provideEventHubConfig()` den Service als Provider (TODO 5).
6. Ergänze einen App-Initializer, der `load(url)` des Service zurückgibt (TODO 6).
7. Lade `/playground` neu. Prüfe im Network-Tab die Reihenfolge von `config.json` und `sessions`.
8. Ändere in `public/config.json` den Wert `featureFlags.comments` auf `false`, lade neu und prüfe die Anzeige. Setze den Wert danach zurück.

## Checkpoint

- Nach Aufgabe 2: Meldung `App nicht gestartet: NG0201: No provider found for …EventHubConfigService`.
- Nach Aufgabe 6: Karte „EventHub Mini-App“ mit API-URL `http://localhost:3000`, Feature „Kommentare“: an, zwölf Sessions.
- Im Network-Tab steht `config.json` vor `sessions`.
- Nach Aufgabe 8 zeigt die Mini-App „aus“, ohne dass `npm start` neu gebaut hat.

## Abschlusskriterien

- `provideEventHubConfig()` liefert `EnvironmentProviders` mit Service und `provideAppInitializer`.
- Die Mini-App startet erst nach geladener `config.json`; die API-URL der Session-Abfrage kommt aus der Datei.
- Die Notiz aus Aufgabe 1 erklärt alle drei Provider der Kurs-App.

## Erweiterung

1. Öffne http://localhost:4200/playground?configUrl=/config-fehlt.json. Der Query-Parameter landet über `withComponentInputBinding()` in `@Input() configUrl` von `Playground`. Notiere die Meldung und erkläre, warum keine Komponente der Mini-App erscheint.
2. Ändere den Initializer so, dass er bei fehlender Datei auf Standardwerte (`apiUrl: 'http://localhost:3000'`, `comments: false`) zurückfällt, statt den Start abzubrechen. Hinweis: `catchError` aus `rxjs` fängt den Fehler im Observable ab und liefert mit `of(...)` einen Ersatzwert.

## Fallback

Die fertige Fassung liegt in `src/app/examples/m02-standalone/l02-bootstrapping/`, URL `/examples/m02-standalone/l02-bootstrapping` (Fehlerfall: `?configUrl=/config-fehlt.json`).
