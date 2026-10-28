# Best Practices

Modulübergreifende Regeln mit Begründung. Die Spalte „Lab“ nennt die Stelle, an der die Regel hergeleitet wird.

## Struktur und Templates

| Regel | Grund | Lab |
| --- | --- | --- |
| Neue Komponenten, Direktiven und Pipes standalone anlegen | Abhängigkeiten stehen sichtbar in `imports`, kein Shared-Module-Wildwuchs | 2.1 |
| Bestandsprojekte schrittweise migrieren, nach jedem Schritt bauen und testen | kleine Diffs lassen sich prüfen und zurückrollen | 2.3 |
| Globale Konfiguration in `app.config.ts` bündeln, Umgebungswerte zur Laufzeit laden | ein Build läuft in allen Umgebungen | 2.2, 13.3 |
| In `@for` immer eine stabile ID als `track` verwenden | Angular erhält DOM und Zustand statt alles neu zu zeichnen | 3.1 |
| Selten sichtbare Bereiche mit `@defer` laden | kleineres Initial-Bundle, schnellere erste Anzeige | 3.2, 13.2 |
| Wiederverwendbares Verhalten als Direktive und per `hostDirectives` komponieren | keine Vererbung zwischen Komponenten, kein kopierter Code | 3.3 |

## Formulare

| Regel | Grund | Lab |
| --- | --- | --- |
| Formulare typisiert und mit `nonNullable` anlegen | `reset()` und `getRawValue()` liefern verlässliche Typen | 4.1 |
| Feldübergreifende Regeln als Validator auf der `FormGroup` | eine Regel, ein Ort, eine Fehlermeldung | 4.2 |
| Eigene Eingabe-Bausteine per `ControlValueAccessor` anbinden | Validierung, `disabled`, `touched` und `reset()` funktionieren wie bei nativen Feldern | 4.3 |
| Neue Formulare mit Signal Forms prüfen, Bestand bei Reactive Forms lassen | Umbau großer Formulare bringt wenig, neue profitieren vom Signal-Modell | 6.4 |

## Reaktivität und State

| Regel | Grund | Lab |
| --- | --- | --- |
| Zustand als Signal, Ereignisse und Zeit als Observable | jedes Werkzeug dort, wo es seine Stärke hat | 6.2 |
| Abgeleitete Werte mit `computed`, nicht mit `effect` | keine doppelten Zustände, keine Zyklen | 6.1 |
| Für Suchen `switchMap`, für Speichern `exhaustMap` oder `concatMap` | verhindert Race Conditions und Doppelaktionen | 5.2, 7.3 |
| Kein manuelles `subscribe` ohne Aufräumen: `async`-Pipe, `toSignal` oder `takeUntilDestroyed` | keine Speicherlecks nach Routenwechseln | 5.3 |
| State-Werkzeug nach Größe wählen: Service mit Signals → Signal Store → NgRx Store | so wenig Struktur wie möglich, so viel wie nötig | 7.1 |
| Reducer rein halten, Seiteneffekte in Effects oder `rxMethod` | testbar und nachvollziehbar | 7.3, 7.4 |

## Routing und Sicherheit

| Regel | Grund | Lab |
| --- | --- | --- |
| Features per `loadComponent`/`loadChildren` laden, Feature-Provider an die Route hängen | Code und Zustand nur dort, wo sie gebraucht werden | 8.1 |
| Preloading gezielt per Strategie statt pauschal | Bandbreite für wahrscheinliche Wege, nicht für Admin-Seiten | 8.2 |
| Autorisierung immer serverseitig prüfen; Guards sind Komfort, kein Schutz | Frontend-Code ist manipulierbar | 9.1 |
| Token zentral per Interceptor anhängen, `401` zentral behandeln | kein Service vergisst den Header | 9.2 |
| Für SPAs Authorization Code Flow mit PKCE, kein Implicit Flow | aktueller Standard, Token nicht in der URL | 9.3 |

## Tests und Auslieferung

| Regel | Grund | Lab |
| --- | --- | --- |
| Viele schnelle Unit- und Komponententests, wenige E2E-Tests | kurze Rückmeldung, stabile Pipeline | 10.1 |
| Komponenten über ihr Verhalten testen, nicht über interne Felder | Tests überleben Refactorings | 10.2 |
| Zeitbasierte Streams mit `TestScheduler` testen | Millisekunden statt echter Wartezeit, deterministisch | 10.3 |
| E2E-Selektoren über `data-cy`, Login per API statt per Formular | Tests flackern nicht bei Layout-Änderungen | 10.5 |
| Geteilte Bausteine als Library mit klarer `public-api.ts` | Änderungen bleiben für andere Teams berechenbar | 11.2 |
| Micro-Frontends nur bei echtem Bedarf an unabhängigen Releases | Aufwand für Versionen, Zustand und UX-Konsistenz ist hoch | 12.1 |
| Vor und nach jeder Optimierung im Produktions-Build messen, Budgets setzen | Erfolg ist belegt, Rückschritte fallen im Build auf | 13.1, 13.2 |
| Ein Container-Image für alle Umgebungen, Konfiguration zur Laufzeit | was getestet wurde, läuft auch in Produktion | 13.3 |
| Jeder Merge läuft durch Lint, Tests, Build mit Budgets | Fehler fallen vor dem Hauptzweig auf | 14.1 |
