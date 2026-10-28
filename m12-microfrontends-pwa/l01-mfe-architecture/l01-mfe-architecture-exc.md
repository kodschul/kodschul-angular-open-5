# Lab 12.1 – Übung: Micro-Frontend-Architektur

**Dauer:** ca. 13 Minuten (Paararbeit 9 Minuten, Vorstellung 4 Minuten)
**Ändert die EventHub-Projektbasis?** Nein — Ergebnis ist eine Entscheidung in Markdown, kein Code.

## Vorbereitung

- Datei anlegen: `mfe-entscheidung.md` (Ort frei, z. B. `output/project/mfe-entscheidung.md`).
- Grundlage: Vergleichstabelle und Entscheidungskriterien aus der Theorie dieses Labs.
- Infoseite der Kurs-App: http://localhost:4200/examples/m12-microfrontends-pwa/l01-mfe-architecture (optional).

## Szenarien

**Szenario A – EventHub mit 2 Teams**

- Team „Programm“ (4 Personen): Session-Liste, Detail, Anmeldung, Favoriten. Release alle zwei Wochen.
- Team „Organisation“ (3 Personen): Admin-Bereich mit Auslastung, Raumplanung, Freigaben. Will bei Bedarf täglich ausliefern.
- Beide Teams nutzen Angular 22, sitzen im selben Unternehmen, teilen Login und Design.
- 80 % der Zugriffe kommen von Smartphones auf der Konferenz.

**Szenario B – Konzernportal mit 8 Teams**

- Mitarbeiterportal mit 8 Fachbereichen (Urlaub, Reisekosten, Kantine, IT-Tickets, …), je ein Team und eigene Release-Planung.
- 6 Teams nutzen Angular 21 oder 22, ein Team React, ein Team betreibt eine 10 Jahre alte AngularJS-Anwendung, die bleiben soll.
- Eine Plattform-Gruppe stellt Shell, Login (OIDC, Lab 9.3) und ein Design-System.
- Nutzung überwiegend am Desktop im Firmennetz.

## Aufgaben

1. Lege in `mfe-entscheidung.md` für jedes Szenario eine Tabelle mit den Spalten „Kriterium“, „Ausprägung im Szenario“, „Folgerung“ an.
2. Wähle für Szenario A drei Kriterien aus der Theorie, fülle die Tabelle und wähle einen Ansatz. Schreibe die Entscheidung in einem Satz darunter.
3. Wiederhole Aufgabe 2 für Szenario B. Mischlösungen sind erlaubt; nenne dann, welcher Fachbereich welchen Ansatz bekommt.
4. Notiere je Szenario das größte Risiko der gewählten Lösung und eine Maßnahme dagegen.
5. Stelle die Entscheidung für Szenario B in höchstens zwei Minuten im Plenum vor.

## Checkpoint

- Jede Tabelle hat drei Zeilen, jede Folgerung verweist auf einen konkreten Ansatz.
- Die Entscheidung steht als ein Satz unter jeder Tabelle.

## Abschlusskriterien

- `mfe-entscheidung.md` enthält zwei Entscheidungen mit je drei Kriterien, einem Risiko und einer Maßnahme.
- Szenario B ordnet jeden Sonderfall (React-Team, AngularJS-Anwendung) einem Ansatz zu.

## Erweiterung

- Ergänze ein drittes Szenario aus dem eigenen Projekt und entscheide dort genauso.
- Skizziere für Szenario A die Ordnerstruktur eines Nx-Workspace mit Tags (Lab 11.1).
