# Lab 14.2 – Lösung: Architektur-Review: Bestands-App modernisieren

Musterplan für „EventHub Classic“. Andere Reihenfolgen sind gültig, wenn sie begründet sind und jede Maßnahme ein prüfbares Messkriterium hat. Info-Seite in der Kurs-App: `/examples/m14-ci-transfer/l02-architecture-review`.

## Aufgabe 1: Datei

```bash
cp output/m14-ci-transfer/anhang-modernisierungsplan-vorlage.md modernisierungsplan.md
```

## Aufgabe 2: Ausgangslage und Ziel

```markdown
## Ausgangslage

- Angular 14.2 mit NgModules, Subject-Services und Karma; Build auf Node.js 16 auf einem Laptop.
- Schmerzpunkte: Admin-Seite nach Releases kaputt (kein E2E, manuelles Deployment), flackernde Liste
  (`*ngFor` ohne `trackBy`), 2,4 MB Initial-Bundle bei abgeschaltetem Budget.
- Vier Personen, Release alle sechs Wochen, Feature „Warteliste“ im ersten Quartal.

## Ziel in sechs Monaten

Angular 22 auf Node.js 24; jede Änderung läuft durch eine grüne Pipeline mit Unit- und E2E-Tests;
ein Docker-Image für Test und Produktion; Initial-Bundle unter 500 kB.
```

## Aufgabe 3: Checkliste

| Bereich | Betroffen? | Notiz |
| --- | --- | --- |
| Version | ja | acht Hauptversionen (15 bis 22), Node.js 16 → 24 |
| Bündelung | ja | fünf NgModules, `SharedModule` mit 40 Deklarationen |
| Templates | ja | `*ngIf`/`*ngFor`, kein `trackBy` → flackernde Liste |
| Abhängigkeiten | ja | Konstruktor-Injection |
| Komponenten-API | ja | `@Input`/`@Output` |
| Reaktivität / State | ja | Subjects, `subscribe` ohne Aufräumen |
| Formulare | ja | `UntypedFormGroup` |
| Routing | teilweise | Admin lazy, Rest eager |
| Sicherheit | ja | Klassen-Guard und -Interceptor, Token im `localStorage` |
| Unit-Tests / E2E | ja | Karma, 12 deaktivierte Tests, Protractor tot |
| Performance | ja | 2,4 MB, Budget abgeschaltet |
| Auslieferung | ja | Build pro Umgebung, SFTP von Hand |
| Wiederverwendung | nein | eine App, kein geteilter Code |

## Aufgabe 4: Fünf Maßnahmen

| Nr. | Maßnahme | Warum an dieser Stelle? | Aufwand | Risiko | Messkriterium | Kurs-Lab |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Sicherheitsnetz: CI-Pipeline (Build, Unit-Tests) auf dem Ist-Stand, 12 `xit` reparieren oder löschen, 3 Cypress-E2E-Tests für Login, Anmeldung, Admin-Seite, Lighthouse- und Bundle-Baseline, Budget auf 2,5 MB als Deckel | Jede folgende Maßnahme braucht einen grünen Vorher-Zustand; der Admin-Fehler nach Releases wird sofort sichtbar | M (ca. 6 PT) | niedrig: ändert keinen Produktionscode | Pipeline läuft bei jedem PR; 0 `xit`; 3 E2E grün; Baseline in `docs/baseline.md` | 14.1, 10.5, 13.1 |
| 2 | Angular-Update 14 → 22 mit `ng update`, eine Hauptversion pro PR; Node.js 24 auf dem Build-Server; ab v21 Testrunner auf Vitest (`refactor-jasmine-vitest`, danach manuelle Nacharbeit) | Neue Werkzeuge (Control Flow, Signals, Vitest) setzen neue Versionen voraus; jede Version bringt ihre Migrationen mit | L (ca. 12–15 PT) | mittel: Breaking Changes in Abhängigkeiten; abgefangen durch Pipeline aus 1 | `ng version` zeigt 22.x; Pipeline grün nach jedem Schritt; `karma.conf.js` gelöscht | 1.1, 2.3, 10.1 |
| 3 | Automatische Migrationen: `standalone` (drei Schritte), `control-flow`, `inject`, `route-lazy-loading`; danach `track` mit ID in allen Listen | Mechanisch, gut reviewbar, schnelle sichtbare Wirkung (Flackern weg, kleineres Bundle) | M (ca. 5 PT) | niedrig bis mittel: generierter Code kann an Sonderfällen scheitern; Diff je Feature prüfen | `grep -rE '\*ngIf\|\*ngFor\|@NgModule' src` liefert 0 Treffer; Initial-Bundle < 1 MB; Budget auf 500 kB/1 MB gesenkt | 2.3, 3.1, 8.1, 13.2 |
| 4 | Auslieferung: Multi-Stage-Docker-Image mit nginx und SPA-Fallback, `config.json` statt `environment.*.ts`, Image-Build in der Pipeline, Deployment desselben Images nach Test und Produktion | Beseitigt den Build pro Umgebung und das manuelle SFTP, die Quelle der Release-Fehler | M (ca. 5 PT inkl. Abstimmung Betrieb) | mittel: neuer Betriebsweg; Parallelbetrieb mit Apache für ein Release | ein Image-Tag läuft in Test und Produktion; Deep-Link `/admin` liefert 200; Deployment ohne Laptop | 2.2, 13.3, 14.1 |
| 5 | Feature für Feature auf Signals: Session- und Favoriten-Service mit Signals bzw. NgRx Signal Store, `subscribe` in Komponenten ersetzen; Anmeldeformular typisieren; Warteliste direkt modern bauen | Fachlich wertvollster Umbau, aber nur sicher mit Pipeline, aktueller Version und Standalone | L (fortlaufend, ca. 2 PT pro Feature) | mittel: Verhaltensänderungen in der Datenlogik; Store-Tests und E2E aus 1 sichern ab | kein `.subscribe(` in Komponenten der umgestellten Features; Profiler zeigt weniger Durchläufe; Warteliste ohne `Subject` | 5.3, 6.1–6.3, 7.1–7.4, 4.1, 10.4 |

## Aufgabe 5: Checkpoint

Typische Korrekturen im Paar:

- „Code aufräumen“ ist kein Messkriterium → ersetzt durch einen `grep`-Befehl oder eine Zahl.
- Signals vor dem Update geplant → geht nicht, Angular 14 hat keine Signals; Reihenfolge getauscht.
- Docker vor der Pipeline → Image ohne Tests verlagert das Risiko nur; nach Maßnahme 1 verschoben.

## Aufgabe 6: Nicht-Ziele und Risiken

```markdown
## Bewusst nicht im Plan

- Micro-Frontends: ein Team, eine App – Lab 12.1 zeigt, dass der Aufwand hier nicht lohnt.
- SSR: öffentliche Seiten sind wenige; erst nach Maßnahme 3 neu bewerten.
- Token-Speicherung (`localStorage` → OIDC mit Code Flow und PKCE, Lab 9.3): wichtig, aber eigenes Projekt mit dem Identity-Team; als Maßnahme 6 vorgemerkt.

## Risiken und Gegenmaßnahmen

| Risiko | Gegenmaßnahme |
| --- | --- |
| Update blockiert an einer Bibliothek ohne neue Version | Abhängigkeiten in Maßnahme 1 inventarisieren, Ersatz früh suchen |
| Feature-Arbeit (Warteliste) und Migration kollidieren | Migration in kleinen PRs je Feature; Warteliste erst nach Maßnahme 3 starten |
```

## Aufgabe 7: Argument für das Team

```markdown
Der erste Schritt ändert keine Zeile Produktionscode: Eine Pipeline mit drei E2E-Tests hätte die
kaputte Admin-Seite der letzten Releases vor der Auslieferung gemeldet. Danach geht jede Änderung
in kleinen PRs, die einzeln zurückgenommen werden können. Angular 14 bekommt keine
Sicherheitsupdates mehr (Supportstatus auf angular.dev/reference/releases); jeder Monat Stillstand
macht den Sprung größer. Messbar wird der Nutzen über Bundle-Größe (heute 2,4 MB),
Lighthouse-Score (heute 41) und Release-Fehler pro Quartal.
```

## Aufgabe 8: Vorstellung

Struktur für 3 Minuten: Ziel (ein Satz) → Reihenfolge der fünf Maßnahmen (eine Folie oder die Tabelle) → beste Maßnahme nach Nutzen/Risiko. Im Musterplan ist das Maßnahme 3: wenig Risiko dank Schematics und Pipeline, sichtbare Wirkung auf Bundle-Größe und Flackern.

## Erweiterung

**Pull Requests für Maßnahme 1 (zwei Wochen):**

| PR | Inhalt |
| --- | --- |
| 1 | Workflow mit `npm ci` und `ng build` (Node.js 16, Ist-Stand) |
| 2 | `ng test` in der Pipeline, 12 `xit` reparieren oder mit Begründung löschen |
| 3 | Cypress einrichten, Login-Test mit `cy.session` |
| 4 | E2E Anmeldung und Admin-Seite, `cy.intercept` für Fehlerfälle |
| 5 | Baseline-Dokument mit Lighthouse- und Bundle-Werten, Budget-Deckel |

**Matrix Nutzen/Risiko:** Maßnahme 1 und 3: hoher Nutzen, niedriges Risiko → zuerst. Maßnahme 2: hoher Nutzen, mittleres Risiko → nach dem Sicherheitsnetz. Maßnahme 4 und 5: hoher Nutzen, mittleres Risiko, abhängig von 2 und 3 → danach. Die Reihenfolge des Plans passt dazu.

**Warteliste:** nach Maßnahme 3 als erstes vollständig modernes Feature: Standalone-Komponenten, Lazy Route mit funktionalem Guard, Typed Form mit eigenem Validator, Signal Store, Vitest- und Cypress-Tests. So dient das Feature als Vorlage für die weitere Umstellung.
