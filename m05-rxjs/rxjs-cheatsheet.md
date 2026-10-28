# Cheatsheet Modul 5: Reaktive Programmierung mit RxJS

RxJS 7.8, Angular 22. Importe aus `rxjs`, wenn nicht anders angegeben.

## Marble-Notation (Text)

| Zeichen | Bedeutung |
| --- | --- |
| `-` | ein Frame ohne Wert (Playground: 100 ms) |
| `a`, `1` | ein Wert, Bedeutung per Legende |
| `\|` | complete |
| `#` | error |
| `(ab)` | mehrere Ereignisse im selben Frame, z. B. `(b\|)` |
| `^` | Zeitpunkt des Abos (Hot Observable) |

## Observables erzeugen und abonnieren

| Code | Wirkung |
| --- | --- |
| `http.get<T>(url)` | Cold: eine Anfrage pro Abo, endet nach der Antwort |
| `interval(1000)` | Cold: alle 1000 ms 0, 1, 2, …; endet nie |
| `of(a, b)` | sendet `a`, `b` sofort, dann complete |
| `new Subject<T>()` / `.next(v)` | Hot: Code schiebt Werte selbst hinein |
| `control.valueChanges` | Werte eines `FormControl`, erst ab der ersten Änderung |
| `obs$.subscribe(fn)` | startet ein Cold Observable, liefert eine `Subscription` |
| `{{ obs$ \| async }}` | abonniert im Template, beendet beim Zerstören (`AsyncPipe` importieren) |
| `@if (obs$ \| async; as wert)` | ein Abo, Wert mehrfach im Block nutzen |

## Operatoren Lab 5.1

| Operator | Wirkung |
| --- | --- |
| `map(fn)` | jeden Wert umwandeln, Zeitpunkte bleiben |
| `filter(fn)` | Werte weglassen, Lücken bleiben |
| `debounceTime(ms)` | erst nach `ms` Ruhe den letzten Wert senden |
| `take(n)` | nach `n` Werten complete |
| `tap({ next, error, complete })` | beobachten, ohne zu ändern (Logging) |

## Higher-Order-Operatoren Lab 5.2

| Operator | Bei neuem äußeren Wert | Einsatz |
| --- | --- | --- |
| `switchMap(fn)` | altes inneres Observable abbrechen | Suche, Laden nach Auswahl |
| `mergeMap(fn)` | parallel weiterlaufen lassen | unabhängige Aktionen |
| `concatMap(fn)` | warten, dann der Reihe nach | Speichern in Reihenfolge |
| `exhaustMap(fn)` | ignorieren, solange eines läuft | Login, Doppelklick-Schutz |

## Suche und Fehler Lab 5.2

| Code | Wirkung |
| --- | --- |
| `distinctUntilChanged()` | gleichen Wert direkt hintereinander unterdrücken |
| `startWith(v)` | Anfangswert voranstellen (z. B. für `valueChanges`) |
| `combineLatest([a$, b$])` | `[a, b]` bei jeder Änderung; wartet auf den ersten Wert jedes Stroms |
| `retry(n)` | bei Fehler bis zu `n`-mal neu abonnieren |
| `catchError(() => of(ersatz))` | Fehler durch Ersatzwert ersetzen; **innen** an der Anfrage, sonst endet die Suche |

## Aufräumen Lab 5.3

| Code | Wirkung |
| --- | --- |
| `takeUntilDestroyed()` | aus `@angular/core/rxjs-interop`; beendet beim Zerstören; nur im Konstruktor/Feld |
| `destroyRef = inject(DestroyRef)` | Zerstörungs-Meldung der Komponente als Feld |
| `takeUntilDestroyed(this.destroyRef)` | dasselbe außerhalb des Injection Context (`ngOnInit`) |
| `destroyRef.onDestroy(fn)` | eigenen Aufräumcode registrieren |
| `tap({ subscribe, unsubscribe, finalize })` | Beginn und Ende eines Abos loggen |

## Mock-API-Schalter

| Query-Parameter | Wirkung |
| --- | --- |
| `_randomDelay=1` | Antwort zufällig 0–1500 ms verzögert |
| `_delay=500` | Antwort um 500 ms verzögert |
| `_fail=500` | Antwort immer mit Status 500 |
