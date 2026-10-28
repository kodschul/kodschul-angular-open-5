# Lab 5.1: Observables und Marble-Diagramme

**Leitfragen:**

<details>
<summary>Was ist der Unterschied zwischen einem Array mit fünf Werten und fünf Klicks?</summary>

Das Array liegt komplett vor, alle Werte sind sofort lesbar. Die Klicks kommen einzeln über die Zeit, und niemand weiß vorher, wann und ob der nächste kommt. Ein Observable beschreibt genau diesen zweiten Fall.

</details>

<details>
<summary>Was passiert mit einer HTTP-Anfrage, wenn niemand das Ergebnis abonniert?</summary>

Bei `HttpClient` nichts: Die Anfrage geht erst mit `subscribe` (oder der `async`-Pipe) raus. Solche Observables heißen „cold“; jedes Abo startet die Arbeit neu.

</details>

<details>
<summary>Wie würde man einem Teammitglied erklären, wann ein Wert ankommt?</summary>

Mit einer Zeitachse: links der Start, rechts später, Werte als Punkte darauf. Genau das ist ein Marble-Diagramm, als Bild oder als Textzeile wie `-a--b-|`.

</details>

- Ein Observable ist ein Strom von Werten über die Zeit, kein fertiger Wert.
- Operatoren nehmen ein Observable und liefern ein neues; im Diagramm verwandeln sie eine Zeitachse in eine andere.
- Marble-Diagramme beschreiben Ströme so genau, dass sie später direkt als Testerwartung dienen (Lab 10.3).

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| Observable | Quelle, die über die Zeit null bis viele Werte sendet und dann endet (complete), scheitert (error) oder ewig läuft |
| Subscription | Das laufende Abo, das `subscribe()` zurückgibt; `unsubscribe()` beendet es |
| Operator | Funktion in `pipe(...)`, die aus einem Observable ein neues macht (`map`, `filter`, …) |
| Marble-Diagramm | Zeitachse mit Werten als „Murmeln“; als Text: ein Zeichen pro Zeiteinheit |
| Frame | Eine Zeiteinheit im Text-Diagramm; im Kurs-Playground 100 ms |
| Cold Observable | Startet seine Arbeit pro Abo neu, z. B. jede `HttpClient`-Anfrage |
| Hot Observable | Sendet unabhängig von Abos; wer später abonniert, verpasst frühere Werte, z. B. ein `Subject` |
| `Subject` | Observable, in das Code selbst Werte schiebt (`next()`); mehrere Abonnenten teilen sich dieselben Werte |

## Array oder Strom

| | Array `[1, 2, 3]` | Observable aus Klicks |
| --- | --- | --- |
| Wann sind die Werte da? | sofort, alle zusammen | einzeln, irgendwann |
| Wie liest man sie? | Schleife, Index | `subscribe`, `async`-Pipe |
| Ende bekannt? | ja, `length` | erst bei `complete`, evtl. nie |
| Fehler | Exception beim Zugriff | eigenes Signal im Strom (`error`) |
| Werkzeug zum Umformen | `array.map`, `array.filter` | Operatoren `map`, `filter` in `pipe()` |

## Cold und Hot

```ts
// Cold: jede subscribe-Zeile löst eine eigene HTTP-Anfrage aus
const sessions$ = this.http.get<Session[]>(`${API_URL}/sessions`);
sessions$.subscribe(); // Anfrage 1
sessions$.subscribe(); // Anfrage 2

// Hot: ein Subject sendet an alle, die gerade zuhören
const klicks = new Subject<string>();
klicks.next('vorher'); // niemand hört zu → geht verloren
klicks.subscribe((wert) => console.log('A', wert));
klicks.next('jetzt'); // A jetzt
```

| | Cold (`HttpClient`, `interval`, `of`) | Hot (`Subject`, DOM-Ereignisse) |
| --- | --- | --- |
| Arbeit startet | mit jedem `subscribe` neu | unabhängig von Abos |
| Später abonniert | bekommt alles von vorn | verpasst Vergangenes |
| Typische Falle | doppelte HTTP-Anfragen durch zwei `async`-Pipes | Werte gehen vor dem Abo verloren |

## Marble-Notation als Text

Ein Text-Diagramm liest sich von links nach rechts; jedes Zeichen ist ein Frame.

```text
Zeichen   Bedeutung
-         ein Frame ohne Wert (im Playground 100 ms)
a  1      ein Wert; Bedeutung per Legende, z. B. a=10
|         complete: Strom endet regulär
#         error: Strom endet mit Fehler
(ab)      mehrere Ereignisse im selben Frame, z. B. (b|) = Wert b und sofort complete
^         Zeitpunkt des Abos (bei Hot Observables)
```

Beispiel mit Legende:

```text
Eingabe:   --a---b-c--|
           a=Klick auf „Merken“, b und c = Doppelklick
Bedeutung: Wert a bei 200 ms, b bei 600 ms, c bei 800 ms, Ende bei 1100 ms
```

## Operatoren als Transformation von Diagrammen

Ein Operator steht zwischen zwei Zeitachsen. Die Diagramme hier zeigen das Prinzip mit anderen Daten als die Übung.

```text
map(x => x + 1)          filter(x => x > 2)
Eingabe: -1--2--5-|      Eingabe: -1--4--2--7-|
Ausgabe: -2--3--6-|      Ausgabe: ----4-----7-|
```

| Operator | Ändert Werte? | Ändert Zeitpunkte? | Ändert Ende? |
| --- | --- | --- | --- |
| `map(fn)` | ja, jeden einzeln | nein | nein |
| `filter(fn)` | lässt Werte weg | nein, Lücken bleiben | nein |
| `debounceTime(ms)` | lässt Werte weg | ja: sendet erst nach `ms` Ruhe den letzten Wert | Ende bleibt; ein noch wartender Wert wird beim Ende sofort gesendet |
| `take(n)` | nur die ersten `n` | nein | ja: endet direkt nach dem `n`-ten Wert |
| `tap(fn)` | nein, nur beobachten | nein | nein |

```text
debounceTime(200), Frame = 100 ms
Eingabe: ab-----c|
Ausgabe: ---b----(c|)     b nach 200 ms Ruhe; c wartet noch, als die Quelle endet → sofort gesendet
```

## Ströme im Playground sichtbar machen

Der Starter der Übung definiert dafür zwei kleine Helfer direkt in der Datei: `zeitstrahl(diagramm)` und `frameSeit(start)` (vergangene Frames seit dem Zeitpunkt `start`, gemessen mit `performance.now()`). Das Beispiel im Repo (`src/app/examples/m05-rxjs/l01-marbles/timeline.ts`) enthält `zeitstrahl` ebenfalls, dazu `protokoll(name)`: ein fertiges `tap`, das jeden Wert mit Frame-Nummer loggt.

```ts
// zeitstrahl: baut aus einem Text-Diagramm ein echtes Observable (1 Zeichen = 100 ms)
zeitstrahl('-a-b|').subscribe(console.log); // nach 100 ms 'a', nach 300 ms 'b', dann complete

// tap mit Observer-Objekt: beobachtet Werte, Ende und Fehler, ohne den Strom zu ändern
const start = performance.now();
quelle$.pipe(
  map((x) => x * 10),
  tap({
    next: (wert) => console.log('[map]', frameSeit(start), wert),
    complete: () => console.log('[map]', frameSeit(start), '|'),
  }),
).subscribe();
```

- `tap` steht dort in der Kette, wo der Strom beobachtet werden soll: vor dem Operator zeigt es die Eingabe, danach die Ausgabe.
- Ohne `subscribe()` läuft nichts: Der Zeitstrahl ist cold.
- Echte Timer schwanken um wenige Millisekunden; eine Abweichung von einem Frame ist normal.

## Interaktive Visualisierung

[rxmarbles.com](https://rxmarbles.com/) zeigt Operatoren als verschiebbare Murmeln: Eingabe-Murmeln ziehen, Ausgabe beobachten (erreichbar, Stand: 28.10.2026, `prüfen`). Die Seite eignet sich zum Nachschlagen eines unbekannten Operators.

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| Konsole bleibt leer | Kette ohne `subscribe()` | `subscribe()` anhängen oder `async`-Pipe nutzen |
| Wert erscheint im Template nicht | Ergebnis in ein normales Feld geschrieben; die App ist zoneless | Observable mit der `async`-Pipe anzeigen |
| Log zeigt Eingabe statt Ausgabe | `tap` steht vor dem Operator | `tap` hinter den Operator setzen |
| Zwei HTTP-Anfragen statt einer | Cold Observable zweimal abonniert | nur einmal abonnieren (eine `async`-Pipe mit `as`) |

## Fazit

- Ein Observable ist ein Strom über die Zeit; erst ein Abo startet einen Cold Stream.
- Text-Diagramme (`-a-b-|`, `#`, `(b|)`) beschreiben Werte, Zeitpunkte und Ende genau.
- Jeder Operator verwandelt ein Diagramm in ein anderes; `tap` macht das Ergebnis sichtbar.

Die Übung zeichnet für vier Ketten das Ausgabe-Diagramm und prüft es anschließend mit `tap`-Logging im Playground.
