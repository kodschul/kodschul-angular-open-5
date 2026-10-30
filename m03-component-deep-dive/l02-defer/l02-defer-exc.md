# Lab 3.2 – Übung: Deferred Loading

**Dauer:** ca. 16 Minuten
**Ändert die EventHub-Projektbasis?** Ja — die Session-Detailseite lädt Speaker-Profil und Kommentare verzögert.

## Vorbereitung

- Terminal 1 im Ordner `project/`: `npm run api`.
- Terminal 2 im Ordner `project/`: `npx ng serve --no-hmr` (ohne HMR, sonst lädt der Dev-Server die `@defer`-Bereiche sofort mit; ein laufendes `npm start` vorher mit Strg+C beenden).
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m03-l02-defer.ts` plus Ordner `src/app/starters/m03-l02-defer/` (`speaker-bio.ts`, `session-comments.ts`)
- Browser: http://localhost:4200/playground, DevTools mit Tab „Network“ (Filter `JS`)

## Aufgaben

1. Kopiere den Ordner `src/app/starters/m03-l02-defer/` nach `src/app/playground/m03-l02-defer/` und den Inhalt von `src/app/starters/m03-l02-defer.ts` nach `src/app/playground/playground.ts`. Die Detailseite zeigt Session 1 mit Speaker-Profil und Kommentaren.
2. Lade `/playground` mit geöffnetem Network-Tab neu und notiere die Anzahl der JS-Dateien. Scrolle danach nach unten: Es kommt keine weitere Datei dazu.
3. Lege um `<app-speaker-bio …/>` einen `@defer (on viewport)`-Block mit `@placeholder` (Hinweistext in einem `<p>`), `@loading (after 100ms; minimum 500ms)` und `@error`.
4. Lege um `<app-session-comments …/>` einen `@defer (on interaction)`-Block. Der `@placeholder` enthält einen Button „Kommentare anzeigen“; ergänze `@loading (minimum 500ms)`.
5. Lade neu, scrolle zum Speaker-Bereich und klicke auf „Kommentare anzeigen“. Beobachte im Network-Tab, wann welche JS-Datei nachgeladen wird.
6. Stelle die Drosselung im Network-Tab auf „Slow 4G“, lade neu und wiederhole Schritt 5: Die `@loading`-Texte werden sichtbar. Stelle die Drosselung zurück.
7. Lass den Dev-Server laufen. Führe in einem dritten Terminal im Ordner `project/` `npx ng build --verbose` aus und suche in „Lazy chunk files“ die Einträge `speaker-bio` und `session-comments`. Mache einen Screenshot dieser Zeilen.

## Checkpoint

- Nach Schritt 3: Beim Laden steht der Placeholder-Text; erst beim Scrollen erscheint das Profil, im Network-Tab kommt eine `chunk-….js` dazu.
- Nach Schritt 4: Die Kommentare erscheinen erst nach dem Klick auf den Button.
- Die Build-Ausgabe nennt `speaker-bio` und `session-comments` unter „Lazy chunk files“. Das fertige Beispiel unter `src/app/examples/` erzeugt Chunks mit denselben Namen; der Nachweis für die eigene Lösung ist deshalb der Network-Tab aus Aufgabe 5.

## Abschlusskriterien

- Detailseite mit zwei verzögerten Bereichen, jeweils mit Placeholder und Ladezustand.
- Screenshot der Build-Ausgabe mit beiden Chunks.

## Erweiterung

- Ergänze beim Kommentarbereich `prefetch on hover` und prüfe im Network-Tab, dass der Chunk schon beim Darüberfahren lädt.
- Ersetze beim Kommentarbereich den Trigger durch `when showComments` mit einem Feld `showComments = false` und einem eigenen Button außerhalb des Blocks, der das Feld auf `true` setzt.
- Simuliere den Fehlerfall: DevTools → Network → Rechtsklick auf den Chunk → „Block request URL“, Seite neu laden und scrollen. Der `@error`-Block erscheint.

## Fallback

Läuft `ng build` zu lange oder fehlt Speicherplatz, reicht der Nachweis im Network-Tab. Die erwartete Build-Ausgabe steht in der Theorie dieses Labs.
