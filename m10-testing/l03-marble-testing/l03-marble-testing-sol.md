# Lab 10.3 – Lösung: Marble-Testing für RxJS-Streams

Referenz: `src/app/examples/m10-testing/l03-marble-testing/session-search.spec.ts` · Beispielseite `/examples/m10-testing/l03-marble-testing`

## Aufgabe 1: Starter kopieren

```bash
cp -r src/app/starters/m10-l03-marble-testing src/app/playground/
npx ng test --include=src/app/playground/m10-l03-marble-testing
```

Die Zusammenfassung zeigt `4 todo`.

## Aufgabe 2: Entprellung

Rechnung: `an` bei 0, `ang` bei 101, `angular` bei 502, Abschluss bei 503.

| Frame | Eingabe | Debounce | Ausgabe |
| --- | --- | --- | --- |
| 0 | `an` | Timer bis 300 | – |
| 101 | `ang` | Timer neu bis 401, `an` verfällt | – |
| 401 | – | Ruhe vorbei | `x` (`ang`) |
| 502 | `angular` | Timer bis 802 | – |
| 503 | Abschluss | letzter Wert sofort | `y` (`angular`) + Abschluss |

```ts
it('wartet 300 ms Ruhe ab und sucht nur den letzten Begriff', () => {
  scheduler.run(({ cold, expectObservable }) => {
    const terms = cold('a 100ms b 400ms c|', { a: 'an', b: 'ang', c: 'angular' });
    const search = (term: string) => cold('(r|)', { r: term === 'angular' ? [angularTalk] : [] });

    const values: Record<string, SearchState> = {
      x: { term: 'ang', sessions: [], error: null },
      y: { term: 'angular', sessions: [angularTalk], error: null },
    };
    expectObservable(sessionSearch(terms, search)).toBe('401ms x 101ms (y|)', values);
  });
});
```

`SearchState` zusätzlich aus `./session-search` importieren. `401ms x 101ms` → `x` bei 401, `y` bei 401 + 1 + 101 = 503.

## Aufgabe 3: Gleicher Begriff

```ts
it('sucht einen gleichen Begriff nicht zweimal', () => {
  scheduler.run(({ hot, cold, expectObservable }) => {
    const terms = hot('a 400ms b', { a: 'rxjs', b: 'rxjs ' });
    const search = vi.fn((_term: string) => cold('(r|)', { r: [rxjsTalk] }));

    expectObservable(sessionSearch(terms, search)).toBe('300ms x', {
      x: { term: 'rxjs', sessions: [rxjsTalk], error: null },
    });
    scheduler.flush(); // virtuelle Zeit bis zum Ende laufen lassen, dann zählen
    expect(search).toHaveBeenCalledTimes(1);
  });
});
```

`map(trim)` macht aus `'rxjs '` wieder `'rxjs'`, `distinctUntilChanged` lässt den Wert bei 701 nicht durch. Ohne `scheduler.flush()` zählt der Spy vor dem Durchlauf der virtuellen Zeit und meldet `0`.

## Aufgabe 4: Abbruch durch switchMap

```ts
it('bestellt die langsame alte Anfrage ab (switchMap)', () => {
  scheduler.run(({ hot, cold, expectObservable, expectSubscriptions }) => {
    const terms = hot('a 400ms b', { a: 'ang', b: 'angular' });
    const slow = cold('500ms r|', { r: [rxjsTalk] });
    const fast = cold('100ms s|', { s: [angularTalk] });
    const search = (term: string) => (term === 'ang' ? slow : fast);

    expectObservable(sessionSearch(terms, search)).toBe('801ms y', {
      y: { term: 'angular', sessions: [angularTalk], error: null },
    });
    expectSubscriptions(slow.subscriptions).toBe('300ms ^ 400ms !');
    expectSubscriptions(fast.subscriptions).toBe('701ms ^ 100ms !');
  });
});
```

| Frame | Ereignis |
| --- | --- |
| 300 | Debounce für `ang` vorbei → `slow` abonniert |
| 401 | `angular` eingegeben |
| 701 | Debounce für `angular` vorbei → `slow` abbestellt (`!`), `fast` abonniert |
| 801 | `fast` liefert → Ausgabe `y` |
| 802 | `fast` schließt ab → abbestellt; die Ausgabe bleibt offen, weil `terms` heiß ist und nicht abschließt |

`'300ms ^ 400ms !'`: `^` bei 300, belegt einen Frame, plus 400 → `!` bei 701.

## Aufgabe 5: Fehlerfall

```ts
it('macht aus einem API-Fehler einen Fehlerzustand und läuft weiter', () => {
  scheduler.run(({ hot, cold, expectObservable }) => {
    const terms = hot('a 400ms b', { a: 'ang', b: 'rxjs' });
    const search = (term: string) =>
      term === 'ang'
        ? cold<Session[]>('50ms #', undefined, new Error('500'))
        : cold('50ms (r|)', { r: [rxjsTalk] });

    expectObservable(sessionSearch(terms, search)).toBe('350ms e 400ms r', {
      e: { term: 'ang', sessions: [], error: 'Suche fehlgeschlagen' },
      r: { term: 'rxjs', sessions: [rxjsTalk], error: null },
    });
  });
});
```

`catchError` sitzt **innerhalb** von `switchMap`. Nur die innere Suche endet mit dem Fehler, der äußere Stream bleibt offen und liefert bei 751 (401 + 300 + 50) das zweite Ergebnis. Säße `catchError` hinter `switchMap`, wäre die Suche nach dem ersten Fehler beendet.

```text
 ✓ src/app/playground/m10-l03-marble-testing/session-search.spec.ts (4 tests) 60ms
```

## Aufgabe 6: mergeMap statt switchMap

Rot wird nur „bestellt die langsame alte Anfrage ab (switchMap)“:

```text
AssertionError: expected [ { frame: 800, …(1) }, …(1) ] to deeply equal [ { frame: 801, …(1) } ]
+     "frame": 800,
      "frame": 801,
```

Mit `mergeMap` läuft die Suche nach `ang` weiter und liefert bei 800 ihr veraltetes Ergebnis, direkt vor dem richtigen bei 801. Genau diese Race Condition aus Lab 5.2 macht der Test sichtbar. Die anderen drei Tests bleiben grün, weil sich dort Anfragen zeitlich nicht überschneiden.

## Erweiterung

`debounceMs` als Parameter:

```ts
it('nutzt eine kürzere Entprellzeit', () => {
  scheduler.run(({ hot, cold, expectObservable }) => {
    const terms = hot('a', { a: 'rxjs' });
    const search = () => cold('(r|)', { r: [rxjsTalk] });
    expectObservable(sessionSearch(terms, search, 100)).toBe('100ms x', {
      x: { term: 'rxjs', sessions: [rxjsTalk], error: null },
    });
  });
});
```

Mindestlänge, zuerst der Test (er ist rot, solange der Filter fehlt):

```ts
it('ignoriert Begriffe mit nur einem Buchstaben', () => {
  scheduler.run(({ hot, cold, expectObservable }) => {
    const terms = hot('a', { a: 'a' });
    const search = vi.fn(() => cold('(r|)', { r: [] as Session[] }));
    expectObservable(sessionSearch(terms, search)).toBe('');
    scheduler.flush();
    expect(search).not.toHaveBeenCalled();
  });
});
```

Danach in `session-search.ts` direkt nach `map((term) => term.trim())` ergänzen: `filter((term) => term.length >= 2),` (Import von `filter` aus `rxjs`).
