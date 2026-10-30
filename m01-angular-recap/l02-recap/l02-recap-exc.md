# Lab 1.2 – Übung: Fix the EventHub

**Dauer:** ca. 27 Minuten (Paararbeit, Zwischenstand nach 20 Minuten)
**Ändert die EventHub-Projektbasis?** Nein — die Arbeit findet nur im Playground statt.

## Vorbereitung

- Terminal 1: `npm run api` (Mock-API auf Port 3000).
- Terminal 2: `npm start` (App auf Port 4200).
- Arbeitsdatei: `src/app/playground/playground.ts` und Ordner `src/app/playground/m01-l02-fix-the-eventhub/`
- Starter: `src/app/starters/m01-l02-fix-the-eventhub.broken.ts` und Ordner `src/app/starters/m01-l02-fix-the-eventhub/`
- URL: http://localhost:4200/playground

Die Starter-App zeigt Sessions als Karten, öffnet über „Details“ eine Detailansicht (`/playground?id=3`) und zählt gemerkte Sessions. Sie enthält sechs typische Fehler aus diesen Bereichen:

| Nr. | Bereich |
| --- | --- |
| 1 | fehlender Import einer Komponente |
| 2 | falsches Binding |
| 3 | Pipe ohne Import |
| 4 | Service nicht bereitgestellt |
| 5 | Link ohne Routen-Parameter |
| 6 | Event nicht weitergegeben |

Dateien mit der Endung `.broken.ts` unter `src/app/starters/` sind vom Build ausgeschlossen, weil sie absichtlich nicht kompilieren. Im Playground gilt das nicht: Nach dem Kopieren werden sie umbenannt (Aufgabe 1) und gehören dann zum Build.

## Aufgaben

1. Kopiere den Starter in den Playground und benenne die defekten Dateien um (im Ordner `project/`):

   ```bash
   cp src/app/starters/m01-l02-fix-the-eventhub.broken.ts src/app/playground/playground.ts
   cp -r src/app/starters/m01-l02-fix-the-eventhub src/app/playground/
   mv src/app/playground/m01-l02-fix-the-eventhub/session-card.broken.ts \
      src/app/playground/m01-l02-fix-the-eventhub/session-card.ts
   ```

   Unter Windows ohne Git Bash: Dateien im Explorer kopieren und umbenennen.
2. Lege eine Fehlerliste an, z. B. als Kommentar am Anfang von `playground.ts`, mit den Spalten Nr. | Symptom | Ursache | Fix.
3. Lies die Fehlermeldungen in Terminal 2. Ordne jede Meldung Template oder Klasse zu und behebe die Build-Fehler, bis die App wieder kompiliert. Neue Meldungen nach einem Fix gehören dazu.
4. Öffne `/playground` und die Browser-Konsole. Behebe den Laufzeitfehler, der die Seite leer lässt.
5. Klicke bei einer Session auf „Details“. Sorge dafür, dass die URL `?id=<id>` erhält und die Detailansicht erscheint; „Schließen“ entfernt den Parameter wieder.
6. Klicke auf „☆ Merken“. Sorge dafür, dass der Zähler „Gemerkt“ steigt und die Karte „★ Gemerkt“ zeigt.
7. Trage alle sechs Fehler in die Fehlerliste ein.
8. Vergleiche mit http://localhost:4200/examples/m01-angular-recap/l02-recap.

## Checkpoint

- Nach 20 Minuten: Build ohne Fehler, Seite zeigt zwölf Karten mit Titel, Datum und Raum.
- `/playground?id=3` zeigt die Detailansicht von „RxJS-Operatoren, die wirklich zählen“ mit Abstract und Speaker.
- Zweimal „Merken“ bei verschiedenen Sessions ergibt „Gemerkt: 2“.

## Abschlusskriterien

- Die App kompiliert, die Konsole ist frei von Fehlern.
- Liste, Detail per Query-Parameter, Datumsformat und Merken funktionieren.
- Die Fehlerliste enthält sechs Einträge mit Symptom, Ursache und Fix; jeder Eintrag ist als Template-, Klassen- oder DI-Problem eingeordnet.

## Erweiterung

Die App enthält zwei versteckte Zusatzfehler ohne Fehlermeldung:

1. Vergleiche die Uhrzeit auf einer Karte mit dem Feld `start` unter http://localhost:3000/sessions/1.
2. Öffne die Details einer Session und klicke danach bei einer anderen Session auf „Details“, ohne vorher zu schließen. Beobachte Titel und URL.

Finde und behebe beide Ursachen und ergänze die Fehlerliste.

## Fallback

- Hängt der Build an einer Stelle fest: `src/app/examples/m01-angular-recap/l02-recap/` enthält die reparierte Fassung; die Kommentare `Fix 1` … `Fix 6` markieren die Stellen.
- Ohne laufende Mock-API zeigt die Liste nur „Lade Sessions …“; Aufgabe 3 (Build-Fehler) bleibt trotzdem machbar.
