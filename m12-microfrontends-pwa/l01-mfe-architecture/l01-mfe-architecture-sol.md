# Lab 12.1 – Lösung: Micro-Frontend-Architektur

Es gibt mehr als eine vertretbare Antwort. Die folgenden Tabellen zeigen eine begründete Musterlösung; abweichende Entscheidungen sind richtig, wenn die Kriterien sie tragen. Die Kurs-App fasst die Vergleichstabelle unter `/examples/m12-microfrontends-pwa/l01-mfe-architecture` zusammen (Datei `src/app/examples/m12-microfrontends-pwa/l01-mfe-architecture/example.ts`).

## Aufgabe 1–2: Szenario A – EventHub mit 2 Teams

| Kriterium | Ausprägung im Szenario | Folgerung |
| --- | --- | --- |
| Unabhängige Deployments | Team „Organisation“ will täglich ausliefern, „Programm“ alle zwei Wochen | spricht für getrennte Auslieferung des Admin-Bereichs |
| Framework-Versionen | beide Angular 22, ein Unternehmen | geteiltes Angular möglich, keine Isolation nötig |
| Ladezeit mobil | 80 % Smartphone-Zugriffe | Angular darf nur einmal geladen werden: Monorepo oder Federation |

**Entscheidung:** Ein Nx-Monorepo mit zwei Apps bzw. Feature-Libraries; nur falls die tägliche Auslieferung des Admin-Bereichs wirklich gebraucht wird, Admin als Native-Federation-Remote mit Host „Programm“ (Lab 12.2).

Begründung der Reihenfolge: Mit zwei Teams im selben Unternehmen löst ein Monorepo mit getrennten Pipelines per `nx affected` (Lab 11.1) die meisten Probleme; Federation bleibt als zweiter Schritt.

## Aufgabe 3: Szenario B – Konzernportal mit 8 Teams

| Kriterium | Ausprägung im Szenario | Folgerung |
| --- | --- | --- |
| Unabhängige Deployments | 8 Teams, eigene Release-Planung | Laufzeit-Integration nötig, ein gemeinsamer Build scheidet aus |
| Framework-Versionen | Angular 21/22, React, AngularJS | Angular-Teams teilen per Federation, Sonderfälle isoliert |
| Gemeinsame Plattform | Shell, Login, Design-System vorhanden | Federation mit Shell als Host realistisch |

**Entscheidung:** Shell (Angular 22) als Native-Federation-Host für die sechs Angular-Teams nach gemeinsamer Anhebung auf Angular 22; React-Team als Web Component; AngularJS-Anwendung im iframe.

| Fachbereich | Ansatz | Grund |
| --- | --- | --- |
| 6 Angular-Teams | Native Federation Remote | ein Angular, gemeinsames Routing, kurze Ladezeit |
| React-Team | Web Component (Custom Element) | eigenes Framework, Schnittstelle über Attribute/Events |
| AngularJS-Altanwendung | iframe | keine Änderung am Altcode, harte Isolation |

## Aufgabe 4: Risiken

| Szenario | Größtes Risiko | Maßnahme |
| --- | --- | --- |
| A | Monorepo wird ohne Regeln zum Monolithen | Tags und `@nx/enforce-module-boundaries`, Admin als eigene Feature-Library |
| B | Versionskonflikte bei geteilten Paketen (Angular 21 vs. 22) | gemeinsamer Upgrade-Takt, `singleton`/`strictVersion` in der Federation-Konfiguration, Plattform-Gruppe gibt Versionen vor |

Weitere mögliche Risiken für B: inkonsistente UX (Maßnahme: Design-System als Library, Lab 11.2), Login-Zustand im iframe (Maßnahme: OIDC-Session im Identity Provider, Lab 9.3).

## Aufgabe 5: Vorstellung

Kurzform für Szenario B: „Acht Teams mit eigenem Release-Takt brauchen Laufzeit-Integration. Die Angular-Teams teilen über Native Federation ein Angular, React kommt als Web Component, die AngularJS-Anwendung bleibt unverändert im iframe. Größtes Risiko sind Versionskonflikte; die Plattform-Gruppe gibt deshalb Angular-Versionen vor.“

## Erweiterung

Ordnerstruktur für Szenario A:

```text
apps/
  eventhub/                      type:app, scope:programm
  eventhub-admin/                type:app, scope:organisation
libs/
  programm/feature-sessions/     type:feature, scope:programm
  organisation/feature-admin/    type:feature, scope:organisation
  shared/ui/                     type:ui, scope:shared
  shared/models/                 type:util, scope:shared
```

Regel zusätzlich zu den Typen: `scope:programm` und `scope:organisation` dürfen nur sich selbst und `scope:shared` importieren.
