# Cheatsheet Modul 6: Reaktivität mit Signals

Angular 22. Importe aus `@angular/core`, wenn nicht anders angegeben.

## Signals Lab 6.1

| Code | Wirkung |
| --- | --- |
| `count = signal(0)` | beschreibbares Signal |
| `count()` | lesen (auch im Template: `{{ count() }}`) |
| `count.set(5)` | neuen Wert setzen |
| `count.update((n) => n + 1)` | neuen Wert aus altem berechnen |
| `items.update((l) => [...l, neu])` | Arrays/Objekte immer neu erzeugen, nie `push` |
| `total = computed(() => a() + b())` | abgeleiteter, gecachter Wert, nur lesbar |
| `effect(() => localStorage.setItem(k, JSON.stringify(x())))` | Seiteneffekt bei jeder Änderung; im Konstruktor/Feld |
| `qty = linkedSignal(() => { sel(); return 1; })` | beschreibbar, springt bei Änderung von `sel` zurück |
| `ids.asReadonly()` | nur lesbare Sicht für Außenstehende |

## Change Detection Lab 6.1

| Code / Fakt | Bedeutung |
| --- | --- |
| zoneless | Default seit v21; Aktualisierung durch Signals, Template-Ereignisse, `async`-Pipe, `markForCheck()` |
| `OnPush` | Default-Strategie in v22, wenn `changeDetection` fehlt |
| `ChangeDetectionStrategy.Eager` | neuer Name der alten Strategie `Default` (veraltet) |
| `ng update` auf v22 | Migration `change-detection-eager` trägt `Eager` in alle bestehenden Komponenten ein |

## Interop und Resources Lab 6.2

| Code | Wirkung |
| --- | --- |
| `toSignal(obs$, { initialValue: x })` | Observable → Signal, Abo endet mit der Komponente (`@angular/core/rxjs-interop`) |
| `toObservable(sig)` | Signal → Observable (`@angular/core/rxjs-interop`) |
| `httpResource<T>(() => url \| undefined)` | GET abhängig von Signals; `undefined` = keine Anfrage (`@angular/common/http`) |
| `rxResource({ params: () => id(), stream: ({ params }) => api.get(params) })` | Resource mit Observable (`@angular/core/rxjs-interop`) |
| `resource({ params, loader: ({ params, abortSignal }) => promise })` | Resource mit Promise |
| `res.value()` / `res.hasValue()` | Ergebnis (wirft im Status `error`) / Prüfung vor dem Zugriff |
| `res.isLoading()` / `res.status()` / `res.error()` | Ladezustand / `idle` `loading` `reloading` `resolved` `error` `local` / Fehler |
| `res.reload()` | erneut laden |
| `res.statusCode()` | HTTP-Status (nur `httpResource`) |

Regel: Zustand → Signal, Ereignisse und Zeit → Observable.

## Komponenten-Kommunikation Lab 6.3

| Code | Wirkung |
| --- | --- |
| `session = input.required<Session>()` | Pflicht-Input als Signal |
| `compact = input(false, { transform: booleanAttribute })` | Input mit Standard und Umwandlung (`<x compact />`) |
| `selected = output<Session>()` / `selected.emit(s)` | Ereignis deklarieren / senden |
| `favorite = model(false)` | Input `favorite` + Output `favoriteChange`, beschreibbar |
| `[(favorite)]="sig"` | Zwei-Wege-Bindung an ein Signal der Eltern-Komponente |
| `box = viewChild.required<ElementRef>('box')` | Element aus dem Template als Signal |
| `cards = viewChildren(SessionCard)` | alle Treffer als Signal-Array |
| `contentChild(X)` | Element aus `<ng-content>` als Signal |
| `ng generate @angular/core:signal-input-migration` | `@Input` → `input()` |
| `ng generate @angular/core:output-migration` | `@Output` → `output()` |
| `ng generate @angular/core:signal-queries-migration` | `@ViewChild` & Co. → `viewChild()` |

## Signal Forms Lab 6.4

Import aus `@angular/forms/signals`.

| Code | Wirkung |
| --- | --- |
| `model = signal({ email: '', password: '' })` | Datenmodell |
| `f = form(model, (p) => { … }, { submission: { action } })` | Formular mit Schema und Absende-Aktion |
| `required(p.email, { message: '…' })` | Pflichtfeld |
| `email(p.email)` / `minLength(p.password, 6)` | E-Mail-Format / Mindestlänge |
| `[formField]="f.email"` | Eingabefeld binden (`FormField` importieren) |
| `<form [formRoot]="f">` | Absenden ohne Neuladen, ruft `action` bei gültigem Formular (`FormRoot` importieren) |
| `f.email().errors()` / `.touched()` / `.valid()` | Feldzustand als Signals |
| `f().valid()` / `f().value()` | Zustand / Wert des ganzen Formulars |
