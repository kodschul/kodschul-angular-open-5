# Lab 14.2 – Übung: Architektur-Review: Bestands-App modernisieren

**Dauer:** ca. 50 Minuten (Paar: Arbeitsphase 30 Minuten mit Checkpoint nach 15 Minuten, Vorstellung 3 Minuten je Paar)
**Ändert die EventHub-Projektbasis?** Nein — Ergebnis ist eine Markdown-Datei mit dem Modernisierungsplan.

## Vorbereitung

- Vorlage: `output/m14-ci-transfer/anhang-modernisierungsplan-vorlage.md`.
- Checkliste „Altbestand → Angular 22“ aus der Theorie dieses Labs.
- Wahl: die beschriebene Bestands-App „EventHub Classic“ (unten) oder das eigene Projekt. Beim eigenen Projekt keine Kundennamen, internen URLs oder Zugangsdaten in die Datei schreiben.

## Ausgangslage: EventHub Classic

Ein Konferenzveranstalter betreibt seit 2021 die Anmelde-App „EventHub Classic“. Vier Entwicklerinnen und Entwickler, Release alle sechs Wochen. Für das erste Quartal ist das Feature „Warteliste“ geplant.

| Bereich | Ist-Zustand |
| --- | --- |
| Version | Angular 14.2, TypeScript 4.8; Build-Server mit Node.js 16 |
| Struktur | `AppModule`, `CoreModule`, `SharedModule` (40 Deklarationen) und die Feature-Module `SessionsModule`, `AdminModule`, `AuthModule`; Admin per `loadChildren` lazy, alles andere eager |
| Templates | `*ngIf`, `*ngFor` ohne `trackBy`, viele Methodenaufrufe in Templates |
| State | Services mit `BehaviorSubject` und öffentlichem `Subject` für „Session geändert“; Komponenten rufen `subscribe` in `ngOnInit` auf, selten `unsubscribe` |
| Formulare | Anmeldeformular mit `UntypedFormGroup` (nach dem Update auf v14 automatisch umbenannt), eigener Validator für E-Mail-Domänen |
| Sicherheit | JWT im `localStorage`, Klassen-Guard `AuthGuard implements CanActivate`, Klassen-Interceptor |
| Tests | Karma + Jasmine, 240 Unit-Tests, davon 12 per `xit` deaktiviert; Protractor-E2E läuft seit 2022 nicht mehr |
| Performance | Initial-Bundle 2,4 MB; Budget in `angular.json` auf 5 MB angehoben; Lighthouse mobil: Score 41 |
| Auslieferung | `ng build --configuration production` auf einem Entwickler-Laptop, je ein Build für Test und Produktion (`environment.test.ts`, `environment.prod.ts`), Upload per SFTP auf einen Apache-Server mit `.htaccess`-Rewrite |
| Probleme laut Team | „Nach jedem Release meldet jemand, dass die Admin-Seite nicht lädt.“ · „Die Liste flackert beim Aktualisieren.“ · „Niemand traut sich an den `SharedModule`.“ |

## Aufgaben

1. Kopiere die Vorlage nach `modernisierungsplan.md` (eigener Ordner oder eigenes Repo).
2. Fülle „Ausgangslage“ mit drei Stichpunkten und formuliere ein prüfbares Ziel für sechs Monate.
3. Gehe die Checkliste aus der Theorie Zeile für Zeile durch und markiere für die App jede Zeile mit „betroffen“ oder „nicht betroffen“ (Notiz reicht).
4. Wähle fünf Maßnahmen und trage sie in die Tabelle ein: Maßnahme, Begründung der Position, Aufwand (S/M/L), Risiko mit Grund, Messkriterium, Kurs-Lab.
5. **Checkpoint nach 15 Minuten:** Prüfe im Paar gegenseitig: Hat jede Maßnahme ein prüfbares Messkriterium? Steht eine riskante Maßnahme vor dem Sicherheitsnetz?
6. Trage mindestens einen Punkt unter „Bewusst nicht im Plan“ und zwei Risiken mit Gegenmaßnahme ein.
7. Schreibe das „Argument für das Team“ (ein Absatz) mit Bezug auf eine Leitfrage dieses Labs.
8. Stelle den Plan in 3 Minuten vor: Ziel, Reihenfolge, die Maßnahme mit dem besten Verhältnis von Nutzen zu Risiko.

## Checkpoint

- Nach Aufgabe 4: fünf Zeilen, jede mit Aufwand, Risiko und Messkriterium.
- Jedes Messkriterium ist ohne Rückfrage prüfbar (Befehl, Zahl oder Ja/Nein).

## Abschlusskriterien

- `modernisierungsplan.md` mit Ausgangslage, Ziel, fünf Maßnahmen in begründeter Reihenfolge, Nicht-Zielen, Risiken und Team-Argument.
- Mindestens drei Maßnahmen verweisen auf ein Kurs-Lab.

## Erweiterung

- Schätze für Maßnahme 1 die einzelnen Pull Requests (Titel, Umfang) für die ersten zwei Wochen.
- Ordne die fünf Maßnahmen in eine 2×2-Matrix (Nutzen hoch/niedrig, Risiko hoch/niedrig) und prüfe, ob die Reihenfolge dazu passt.
- Plane, in welchem Schritt das Feature „Warteliste“ entsteht und mit welchen modernen Werkzeugen es gebaut wird.
