# Lab 13.1 – Lösung: Performance messen mit Lighthouse und DevTools

Code der gemessenen App: `project/workspaces/eventhub-perf/`. Info-Seite in der Kurs-App: `/examples/m13-performance-docker/l01-measure`.

Die Werte unten stammen aus einer Messung am 28.10.2026 auf einem Apple-Silicon-Laptop (Chrome headless, Lighthouse 13.6 CLI, Mobil-Profil mit simulierter Drosselung, Mock-API lokal). Eigene Werte weichen ab; entscheidend sind Größenordnung und Richtung.

## Aufgabe 1: Produktions-Build mit Statistikdatei

```bash
npm run build:stats
```

```text
Hero-Bild erzeugt: public/img/hero.png (2400x1200, 4.7 MB)
Initial chunk files | Names         |  Raw size | Estimated transfer size
main-BRQTNP33.js    | main          | 471.96 kB |               133.87 kB
styles-Z3QJSWY5.css | styles        |   1.96 kB |               705 bytes
                    | Initial total | 473.92 kB |               134.57 kB
```

Es gibt keine „Lazy chunk files“: Startseite, Detailseite und Diagramm stecken komplett in `main-….js`. Das Budget (2 MB / 5 MB) meldet nichts.

## Aufgabe 2: Statischer Server

```bash
npm run serve:dist
# Serving! Local: http://localhost:8081
```

Das Programm zeigt 12 Sessions. Ohne laufende Mock-API erscheint „Programm konnte nicht geladen werden“.

## Aufgabe 3: Lighthouse (Mobil)

| Kennzahl | Lauf 1 | Lauf 2 | Lauf 3 | Median |
| --- | --- | --- | --- | --- |
| Performance-Score | 36 | 25 | 29 | 29 |
| FCP | 0,7 s | 0,7 s | 0,6 s | 0,7 s |
| LCP | 26,5 s | 26,3 s | 26,4 s | 26,4 s |
| TBT | 4.660 ms | 7.540 ms | 1.040 ms | 4.660 ms |
| CLS | 0 | 0,385 | 0,743 | 0,385 |
| Übertragene Daten | 4.990 KiB | 5.007 KiB | 4.982 KiB | ca. 5 MB |

- **LCP extrem hoch:** Unter simulierter Mobilverbindung dauert die 4,7-MB-Datei viele Sekunden.
- **TBT hoch und schwankend:** Lange Aufgaben beim Start; die Höhe hängt davon ab, wie viele Ticks der Uhr in die Messung fallen.
- **CLS schwankend:** Ob die Verschiebung durch das Bild in die Messung fällt, hängt davon ab, ob das Bild vor oder nach dem ersten Zeichnen ankommt. Lokal ist es oft schon da; über ein echtes Netz verschiebt es den Text darunter.

Desktop-Profil zum Vergleich (ein Lauf): Score 48, LCP 4,4 s, TBT 380 ms, CLS 0,248.

## Aufgabe 4: LCP-Element und Hinweise

LCP-Element (Insight „LCP breakdown“): `<img src="img/hero.png" class="hero">`.

| Hinweis (Lighthouse 13) | Bedeutung |
| --- | --- |
| „Improve image delivery“ / „Avoid enormous network payloads“ | Bild ist 2400 × 1200 Pixel und 4,7 MB groß, angezeigt werden höchstens ca. 1050 Pixel Breite |
| „Image elements do not have explicit `width` and `height`“ / „Layout shift culprits“ | Bild ohne Abmessungen: Der Browser reserviert keinen Platz, Text darunter springt |
| „Reduce JavaScript execution time“ / „Minimize main-thread work“ | lange Aufgaben im Haupt-Thread |
| „Reduce unused JavaScript“ | Code im Start-Bundle, den die erste Ansicht nicht braucht |
| „Use efficient cache lifetimes“ | der lokale Server setzt keine Cache-Header (Thema in Lab 13.3) |

## Aufgabe 5: Bundle-Analyse

Treemap von `main-….js` (Werte als Anteil im minifizierten Bundle, ausgelesen aus `browser-stats.json`):

| Paket | Größe |
| --- | --- |
| `chart.js` | ca. 194 kB |
| `@angular/core` | ca. 119 kB |
| `@angular/router` | ca. 75 kB |
| `@angular/common`, `rxjs`, `@kurkle/color`, App-Code | zusammen ca. 70 kB |

`chart.js` belegt rund 40 % des Start-Codes, wird aber erst unter der Session-Liste gebraucht. Ursache in `src/app/stats/booking-chart.ts`: `Chart.register(...registerables)` registriert alle Diagrammtypen, und `home.ts` importiert `BookingChart` direkt.

## Aufgabe 6: Entwicklungsserver

```bash
npm start
# Hero-Bild vorhanden, ng serve --port 4300
```

## Aufgabe 7: Profiler

Erwartetes Bild (die Millisekunden hängen stark vom Rechner ab):

- Pro Tastendruck ein Durchlauf, zusätzlich ein Durchlauf pro Sekunde durch die Uhr „aktualisiert vor … s“.
- In jedem Durchlauf ist `SessionList` die mit Abstand teuerste Komponente, deutlich über 16 ms (ein Bild bei 60 Hz).
- Ursache in `src/app/sessions/session-list.ts`: `relevance(session)` steht dreimal pro Karte im Template (`[class.score-high]`, `[class.score-low]`, Badge). Bei 12 Sessions sind das 36 teure Aufrufe pro Durchlauf, auch wenn sich an den Sessions nichts geändert hat.

## Aufgabe 8: Konsolenwarnung

```text
NG0956: The configured tracking expression (track by identity) caused re-creation of the entire
collection of size 12. This is an expensive operation requiring destruction and subsequent creation
of DOM nodes, directives, components etc.
```

Alle 10 Sekunden lädt `sessions.reload()` neue Objekte. `@for (…; track session)` vergleicht nach Objektidentität, erkennt keine Karte wieder und baut alle 12 Karten neu.

Zusätzlich meldet Angular beim Laden `NG0913: An image with src … has intrinsic file dimensions much larger than its rendered size.`

## Aufgabe 9: Messprotokoll (Beispiel)

```markdown
| Nr. | Messwert / Beobachtung | Ort im Code | Vermutete Ursache | Mögliche Technik |
| --- | --- | --- | --- | --- |
| 1 | LCP 26,4 s (mobil), 4,7 MB Bild, CLS 0,385 (Median) | home/home.ts (img.hero), public/img/hero.png | Bild viel zu groß, ohne width/height | passende Bildgröße, NgOptimizedImage mit width/height und priority |
| 2 | Initial 474 kB, davon chart.js ca. 194 kB | home/home.ts importiert BookingChart, stats/booking-chart.ts | Diagramm unter der Liste wird sofort geladen | @defer (on viewport) aus Lab 3.2 |
| 3 | TBT mehrere Sekunden, Profiler: SessionList > 16 ms pro Durchlauf, NG0956 | sessions/session-list.ts | Methode relevance() im Template, track nach Objekt | Score per computed() einmal berechnen, track session.id |
```

## Erweiterung

- **Performance-Panel:** „Bottom-Up“ nennt `relevance` als Funktion mit der höchsten Self Time. Methodennamen bleiben auch im minifizierten Build lesbar, weil esbuild Eigenschaftsnamen nicht kürzt.
- **Desktop vs. Mobil:** LCP und TBT sinken am Desktop stark (schnellere simulierte Verbindung und CPU), CLS bleibt ähnlich, weil die Verschiebung nicht von der Geschwindigkeit abhängt.
