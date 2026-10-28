# Lab 5.1 – Lösung: Marble-Diagramme zeichnen und prüfen

Referenz: `src/app/examples/m05-rxjs/l01-marbles/` (`example.ts`, `timeline.ts`), im Browser `/examples/m05-rxjs/l01-marbles`.

## Aufgabe 1: Starter kopieren

`/playground` zeigt die Überschrift „Lab 5.1 Marble-Diagramme prüfen“ und den Button „Ketten starten“. Ein Klick loggt nur `Start, Frame 0`, weil noch keine Kette etwas protokolliert.

## Aufgabe 2: Ausgabe-Diagramme

```text
1 map(x => x * 10)
Eingabe: -1-2-3|
Ausgabe: -a-b-c|          a=10 b=20 c=30

2 filter(x => x % 2 === 0)
Eingabe: -1-2-3-4-5|
Ausgabe: ---2---4--|

3 debounceTime(300)
Eingabe: abc----de------|
Ausgabe: -----c-----e---|  c='ang' e='angul'

4 take(2)
Eingabe: -a-b-c-d|
Ausgabe: -a-(b|)
```

## Aufgabe 3: Zeitpunkte bei `debounceTime`

- `a`, `b`, `c` kommen in den Frames 0, 1, 2. Jeder neue Wert startet die 300 ms neu; nach `c` ist Ruhe, also sendet `debounceTime` `c` in Frame 2 + 3 = **5**.
- `d`, `e` kommen in den Frames 7 und 8; `e` wird in Frame 8 + 3 = **11** gesendet.
- `complete` kommt in Frame 15 durch, zu dem Zeitpunkt wartet kein Wert mehr.

## Aufgabe 4: `tap` hinter jedem Operator

```ts
start(): void {
  console.clear();
  const start = performance.now();
  const log = (name: string) =>
    tap({
      next: (wert: unknown) => console.log(`[${name}] Frame ${frameSeit(start)}: ${JSON.stringify(wert)}`),
      complete: () => console.log(`[${name}] Frame ${frameSeit(start)}: |`),
    });

  zeitstrahl('-1-2-3|', { 1: 1, 2: 2, 3: 3 })
    .pipe(map((x) => x * 10), log('1 map'))
    .subscribe();

  zeitstrahl('-1-2-3-4-5|', { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 })
    .pipe(filter((x) => x % 2 === 0), log('2 filter'))
    .subscribe();

  zeitstrahl('abc----de------|', { a: 'a', b: 'an', c: 'ang', d: 'angu', e: 'angul' })
    .pipe(log('3 eingabe'), debounceTime(300), log('3 debounceTime'))
    .subscribe();

  zeitstrahl('-a-b-c-d|')
    .pipe(take(2), log('4 take'))
    .subscribe();
}
```

`tap` aus `rxjs` zusätzlich importieren. Das Beispiel im Repo verpackt dasselbe in die Funktion `protokoll(name)` in `timeline.ts`; dort misst jede Kette ab ihrem eigenen `subscribe`.

## Aufgabe 5: Eingabe von Kette 3 sichtbar machen

Das `tap` vor `debounceTime` (`log('3 eingabe')`) steht bereits im Code von Aufgabe 4. Die Position in der Kette entscheidet, was geloggt wird.

## Aufgabe 6: Log vergleichen

Log nach Frame sortiert (gekürzt auf die Kettenzeilen; Werte können um einen Frame schwanken):

```text
[3 eingabe] Frame 0: "a"
[1 map] Frame 1: 10
[3 eingabe] Frame 1: "an"
[4 take] Frame 1: "a"
[3 eingabe] Frame 2: "ang"
[1 map] Frame 3: 20
[2 filter] Frame 3: 2
[4 take] Frame 3: "b"
[4 take] Frame 3: |
[1 map] Frame 5: 30
[3 debounceTime] Frame 5: "ang"
[1 map] Frame 6: |
[3 eingabe] Frame 7: "angu"
[2 filter] Frame 7: 4
[3 eingabe] Frame 8: "angul"
[2 filter] Frame 10: |
[3 debounceTime] Frame 11: "angul"
[3 eingabe] Frame 15: |
[3 debounceTime] Frame 15: |
```

Häufige Irrtümer und ihre Ursache:

| Irrtum | Ursache |
| --- | --- |
| `filter` rückt Werte nach vorn (`-2-4|`) | `filter` ändert keine Zeitpunkte, nur die Anzahl |
| `debounceTime` sendet `a`, `ang` | Der Timer startet bei jedem Wert neu, gesendet wird nur der letzte Wert vor der Pause |
| `take(2)` endet erst bei Frame 8 | `take` beendet den Strom sofort mit dem zweiten Wert und bestellt die Quelle ab |

## Aufgabe 7: Ohne `subscribe`

Ohne `.subscribe()` fehlen alle Zeilen von Kette 4. Der Zeitstrahl ist ein Cold Observable: Erst das Abo startet die Timer. `pipe()` beschreibt nur die Kette, führt sie aber nicht aus.

## Erweiterung

```text
debounceTime(300) mit früherem Ende
Eingabe: abc----de|
Ausgabe: -----c---(e|)    e wartet noch, als die Quelle in Frame 9 endet → sofort gesendet
```

Auf rxmarbles.com zeigt der Operator `debounceTime` dasselbe Verhalten: Murmeln, die kurz hintereinander liegen, fallen bis auf die letzte weg.
