# Lab 6.2 – Lösung: Suche und Detail ohne subscribe

Referenz: `src/app/examples/m06-signals/l02-interop/` (`example.ts`, `session-detail.ts`), im Browser `/examples/m06-signals/l02-interop` und z. B. `/examples/m06-signals/l02-interop?id=3`.

## Aufgabe 1: Starter

- `/playground`: rechts „Session links auswählen.“, links „Suche läuft …“: Der Platzhalter `of(null)` liefert kein Suchergebnis, `@if (result(); as r)` greift nicht.
- `/playground?id=3`: Der Router schreibt `'3'` in `@Input() id`, die Detail-Komponente erscheint, zeigt aber „Noch nichts geladen.“, weil `httpResource` keine URL bekommt (Status `idle`).

## Aufgabe 2: `httpResource` mit Signal-URL

```ts
protected readonly session = httpResource<Session>(() => {
  const id = this.sessionId();
  return id ? `${API_URL}/sessions/${id}` : undefined;
});
```

Die Funktion liest `sessionId()`. Ändert der Setter das Signal, berechnet `httpResource` die URL neu, bricht eine laufende Anfrage ab und startet die neue.

## Aufgabe 3: Lade- und Fehlerzustand

| URL | Anzeige | `status()` |
| --- | --- | --- |
| `/playground?id=3` | kurz „Lade Session 3 …“, dann Titel „RxJS-Operatoren, die wirklich zählen“, Abstract, Speaker | `loading` → `resolved` |
| `/playground?id=999` | „Fehler 404: Session 999 nicht geladen.“ und Button | `error` |
| „Erneut versuchen“ | neue Anfrage im Network-Tab, wieder 404 | `loading` → `error` |

`reload()` wiederholt dieselbe Anfrage; die API antwortet für 999 weiterhin mit 404.

## Aufgabe 4: Suche per `toSignal`

```ts
protected readonly result = toSignal(
  createSessionSearch(toObservable(this.term), toObservable(this.level), (q, level) =>
    this.api.getSessions({ q, level }),
  ),
  { initialValue: null },
);
```

Der Import von `of` wird danach nicht mehr gebraucht. Die gesamte RxJS-Logik aus Lab 5.2 (Entprellen, `switchMap`, Fehlerbehandlung) bleibt unverändert; nur Ein- und Ausgang sind jetzt Signals.

## Aufgabe 5: Auswahl und Abbruch

- `test` zeigt nach 300 ms Pause zwei Treffer („Testen ohne Tränen“, „E2E-Tests, die nicht flackern“).
- Klick auf einen Treffer setzt `?id=7` bzw. `?id=8`; der Router aktualisiert `@Input() id`, die Detail-Komponente bekommt den neuen Wert und lädt neu.
- Bei schnellem Doppelwechsel (lokal oft zu schnell sichtbar; mit `_delay` aus der Erweiterung deutlich) steht die erste Anfrage als `(canceled)` im Network-Tab.

## Aufgabe 6: Kein `subscribe`

`subscribe(` kommt in `playground.ts` null Mal vor. Abos verwalten `toSignal` (Suche) und `httpResource` (Detail); beide beenden sie beim Zerstören der Komponente.

## Erweiterung

```ts
private readonly api = inject(SessionApi);

protected readonly session = rxResource({
  params: () => this.sessionId(),
  stream: ({ params: id }) => this.api.getSession(id),
});
```

Import: `rxResource` aus `@angular/core/rxjs-interop`, `inject` aus `@angular/core`. Verhalten im Template gleich. `statusCode()` gibt es nur bei `httpResource`; ohne Entfernen aus dem Template meldet der Compiler „Property 'statusCode' does not exist“. Liefert `params` `undefined`, bleibt die Resource `idle`.

Verzögerung testen:

```ts
return id ? `${API_URL}/sessions/${id}?_delay=1500` : undefined;
```

„Lade Session … “ steht 1,5 Sekunden; ein zweiter Klick in dieser Zeit bricht die erste Anfrage sichtbar ab.
