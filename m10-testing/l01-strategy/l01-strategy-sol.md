# Lab 10.1 – Lösung: Teststrategie und Vitest

Referenz: `src/app/examples/m10-testing/l01-strategy/workshop-stats.spec.ts` · Beispielseite `/examples/m10-testing/l01-strategy`

## Aufgabe 1: Testlauf starten

```bash
npm run test:run
```

Die Zusammenfassung am Ende hat diese Form; die Zahlen hängen davon ab, wie viele Beispiele und Starter im Repo Tests enthalten. Gemessen am Kurs-Repo (Stand 28.10.2026):

```text
 Test Files  12 passed | 5 skipped (17)
      Tests  37 passed | 13 todo (50)
   Duration  6.15s
```

`skipped` und `todo` stammen aus den Starter-Specs der Labs 10.2–10.4: Sie liegen mit `it.todo` unter `src/app/starters/` und werden mitgefunden, weil `tsconfig.spec.json` alle `*.spec.ts` aufnimmt. Eine Datei, die nur `todo`-Tests enthält, zählt als `skipped`.

`Duration` enthält Build und jsdom-Start; die Tests selbst brauchen Millisekunden.

## Aufgabe 2–3: Starter kopieren und umbenennen

```bash
cp -r src/app/starters/m10-l01-strategy src/app/playground/
mv src/app/playground/m10-l01-strategy/workshop-stats.spec.jasmine.txt \
   src/app/playground/m10-l01-strategy/workshop-stats.spec.ts
```

Unterordner im Playground behalten die relativen Importe (`../../shared/api`) bei.

## Aufgabe 4: Erste Fehlermeldung

```text
✘ [ERROR] TS2304: Cannot find name 'jasmine'.
✘ [ERROR] TS2339: Property 'toBeTrue' does not exist on type 'Assertion<void, boolean>'.
✘ [ERROR] TS2551: Property 'toHaveBeenCalledOnceWith' does not exist ... Did you mean 'toHaveBeenCalledOnce'?
✘ [ERROR] TS2304: Cannot find name 'spyOn'.
```

Der Build bricht vor dem ersten Test ab, weil TypeScript nur die Vitest-Globals kennt (`tsconfig.spec.json`: `"types": ["vitest/globals"]`).

## Aufgabe 5–7, 9: Vitest-Fassung

```ts
describe('warnIfAlmostFull', () => {
  it('meldet eine fast volle Session über den Callback', () => {
    const notify = vi.fn(); // statt jasmine.createSpy('notify')

    const warned = warnIfAlmostFull(makeSession({ booked: 19 }), notify);

    expect(warned).toBe(true); // statt toBeTrue()
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith('Testen ohne Tränen: 95 % gebucht');
    // alternativ in einer Zeile: toHaveBeenCalledExactlyOnceWith(...)
  });

  // Aufgabe 9
  it('bleibt bei geringer Auslastung still', () => {
    const notify = vi.fn();
    expect(warnIfAlmostFull(makeSession({ booked: 5 }), notify)).toBe(false);
    expect(notify).not.toHaveBeenCalled();
  });
});

describe('logSoldOut', () => {
  afterEach(() => vi.restoreAllMocks()); // Jasmine räumt automatisch auf, Vitest nicht

  it('schreibt eine Warnung pro ausgebuchter Session', () => {
    // vi.spyOn ruft console.warn sonst weiterhin auf
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const count = logSoldOut([makeSession({ booked: 20 }), makeSession({ id: 2, booked: 3 })]);

    expect(count).toBe(1);
    expect(warn).toHaveBeenCalledWith('Ausgebucht: Testen ohne Tränen');
  });
});

describe('WorkshopStats', () => {
  it('zählt die Workshops aus der API-Antwort', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    const api = TestBed.inject(SessionApi);
    const getSessions = vi
      .spyOn(api, 'getSessions')
      .mockReturnValue(of([makeSession(), makeSession({ id: 2 })])); // statt .and.returnValue

    const count = await firstValueFrom(TestBed.inject(WorkshopStats).countWorkshops());

    expect(count).toBe(2);
    expect(getSessions).toHaveBeenCalledWith({ type: 'workshop' });
  });
});
```

Import-Zeilen und `makeSession` bleiben wie im Starter. `vi`, `describe`, `it`, `expect` brauchen keinen Import.

Ergebnis:

```text
 ✓ src/app/playground/m10-l01-strategy/workshop-stats.spec.ts (4 tests)
 Test Files  1 passed (1)
      Tests  4 passed (4)
```

## Aufgabe 8: Test wird rot

Mit Grenze `96` liefert `warnIfAlmostFull` bei 19/20 (95 %) `false`. Rot wird „meldet eine fast volle Session über den Callback“:

```text
AssertionError: expected false to be true
```

Eine Grenze von `95` wäre dagegen unbemerkt geblieben, weil kein Test genau an der Grenze prüft. Folgerung für eigene Tests: Grenzwerte (89 %, 90 %) explizit testen.

## Aufgabe 10: Coverage

```bash
npx ng test --watch=false --coverage --include=src/app/playground/m10-l01-strategy
```

Auszug aus der Tabelle im Terminal (gemessen mit der Lösung oben, vier Tests):

```text
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
...0-l01-strategy  |     100 |    88.88 |     100 |     100 |
  ...shop-stats.ts |     100 |    88.88 |     100 |     100 | 11
shared             |   54.54 |    83.33 |       0 |   42.85 |
  api.ts           |   54.54 |    83.33 |       0 |   42.85 | 22-31
```

Alle Zeilen von `workshop-stats.ts` laufen (100 % Lines), aber nicht alle Zweige (88,88 % Branch). Zeile 11 ist `bookingRate`: Der Zweig `session.capacity === 0 ? 100` wird nie genommen, weil alle Testdaten Kapazität 20 haben. Zeilen-Coverage allein hätte diese Lücke nicht gezeigt. `api.ts` erscheint, weil der Service-Test die echte `SessionApi` erzeugt; `getSessions` ersetzt der Spy, die übrigen Methoden ruft kein Test auf. Der HTML-Bericht liegt unter `coverage/project/index.html`.

## Erweiterung: Refactoring-Schematic

`ng g @schematics/angular:refactor-jasmine-vitest` erzeugt unter anderem:

```ts
const notify = vi.fn().mockName('notify');
const warn = vi.spyOn(console, 'warn').mockReturnValue(undefined);
```

| Punkt | Schematic | Handarbeit |
| --- | --- | --- |
| `createSpy('x')` | `vi.fn().mockName('x')` | `vi.fn()` |
| `spyOn(console, 'warn')` | `.mockReturnValue(undefined)` (Jasmine-Verhalten nachgebaut) | `.mockImplementation(() => undefined)` |
| Aufräumen der Spies | nicht ergänzt | `afterEach(() => vi.restoreAllMocks())` |
| `toBeTrue`, `toHaveBeenCalledOnceWith` | umgeschrieben | umgeschrieben |

Der Schematic erledigt die mechanische Arbeit; das Aufräumen der Spies bleibt Handarbeit.
