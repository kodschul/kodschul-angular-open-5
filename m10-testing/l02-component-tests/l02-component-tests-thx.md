# Lab 10.2: Komponenten- und Service-Tests

**Leitfragen:**

<details>
<summary>Was soll ein Test über eine Komponente prüfen: ihren Code oder ihr Verhalten?</summary>

Das Verhalten: was im DOM steht und was nach einem Klick passiert. Tests, die private Methoden oder Feldnamen prüfen, brechen bei jedem Umbau, obwohl die Komponente noch funktioniert.

</details>

<details>
<summary>Wie testet man einen Service, ohne dass ein Server läuft?</summary>

Angular ersetzt das HTTP-Backend im Test durch eine Attrappe (`HttpTestingController`). Der Test prüft die ausgehende Anfrage und liefert die Antwort selbst, auch Fehler.

</details>

<details>
<summary>Was sollte ein Test für den Login-Schutz aus Lab 9.2 beweisen?</summary>

Dass die Rolle `admin` durchkommt, alle anderen umgeleitet werden (mit Rücksprung-URL) und dass Anfragen das Token tragen. Ob der Server richtig prüft, beweist ein Frontend-Test nicht.

</details>

- `TestBed` erzeugt Standalone-Komponenten direkt über `imports`; ein `declarations`-Array gibt es nicht mehr.
- Die App ist zoneless: Nach Eingaben und Klicks wartet der Test mit `await fixture.whenStable()`, statt auf Zone.js zu vertrauen.
- Code unter Test liegt als eigene Kopie im Lab-Ordner: Session-Karte aus Lab 6.3, `AuthService`, Interceptor und Guard aus Lab 9.2 (vereinfacht).

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| `TestBed` | Test-Injector von Angular: stellt Provider bereit und erzeugt Komponenten wie in der App |
| `ComponentFixture` | Hülle um eine erzeugte Komponente: Zugriff auf Instanz (`componentInstance`), DOM (`nativeElement`) und `componentRef` |
| `fixture.componentRef.setInput()` | setzt einen Input so, wie ein Eltern-Template es täte; funktioniert für Signal-Inputs (`input()`, `model()`) |
| `fixture.whenStable()` | Promise, das erfüllt ist, wenn Angular alle anstehenden Aktualisierungen ausgeführt hat |
| `HttpTestingController` | Attrappe für das HTTP-Backend: Anfragen abfangen, prüfen, beantworten |
| Injection Context | Umgebung, in der `inject()` funktioniert; im Test mit `TestBed.runInInjectionContext()` |

## Komponententest mit Signal-Inputs

Beispiel: eine Speaker-Karte nach demselben Muster wie die Session-Karte aus Lab 6.3 (Signal-Input für die Daten, `model()` für einen Schalter). Die Übung wendet das Muster auf die Session-Karte an.

```ts
@Component({
  selector: 'app-speaker-card',
  template: `
    <h3>{{ speaker().name }}</h3>
    <p class="muted">{{ speaker().company }}</p>
    <button type="button" (click)="followed.set(!followed())">
      {{ followed() ? 'Gefolgt' : 'Folgen' }}
    </button>
  `,
})
export class SpeakerCard {
  readonly speaker = input.required<Speaker>();
  readonly followed = model(false);
}
```

```ts
describe('SpeakerCard', () => {
  let fixture: ComponentFixture<SpeakerCard>;
  let element: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [SpeakerCard] }); // Standalone: imports
    fixture = TestBed.createComponent(SpeakerCard);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('speaker', { id: 4, name: 'Mira Marble', company: 'RxLab', bio: '' }); // Signal-Input setzen
    await fixture.whenStable(); // Template ist gerendert
  });

  it('zeigt die Firma des Speakers', () => {
    expect(element.querySelector('p')?.textContent).toContain('RxLab');
  });

  it('schaltet beim zweiten Klick zurück und meldet beide Änderungen', async () => {
    const changes: boolean[] = [];
    fixture.componentInstance.followed.subscribe((value) => changes.push(value)); // = (followedChange)

    const button = element.querySelector('button')!;
    button.click();
    button.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.followed()).toBe(false);
    expect(changes).toEqual([true, false]);
    expect(button.textContent).toContain('Folgen');
  });
});
```

| Aufgabe im Test | Klassisch (`@Input`, Zone.js) | Heute (Signal-Input, zoneless) |
| --- | --- | --- |
| Input setzen | `component.speaker = s` | `fixture.componentRef.setInput('speaker', s)` |
| Ansicht aktualisieren | `fixture.detectChanges()` | `await fixture.whenStable()` |
| Output beobachten | `component.followedChange.subscribe(...)` | `component.followed.subscribe(...)` (`model()` und `output()` haben `subscribe`) |
| Komponente bereitstellen | `declarations: [SpeakerCard]` | `imports: [SpeakerCard]` |

`component.speaker = s` funktioniert bei Signal-Inputs nicht: `input()` ist schreibgeschützt. Zwei-Wege-Bindung lässt sich mit einer kleinen Host-Komponente im Test prüfen (`[(followed)]="isFollowed"`, Muster im Beispiel `session-card.spec.ts`).

## Service-Test mit HttpTestingController

Getestet wird `SessionApi` aus `src/app/shared/api.ts`; die Beispiele nutzen `getSpeakers()` und `getSession(id)`, die Übung `getSessions(query)`.

```ts
let api: SessionApi;
let httpTesting: HttpTestingController;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()], // Reihenfolge: erst Client, dann Testing
  });
  api = TestBed.inject(SessionApi);
  httpTesting = TestBed.inject(HttpTestingController);
});

afterEach(() => httpTesting.verify()); // keine offenen oder unerwarteten Anfragen

it('lädt die Speaker per GET', () => {
  let result: Speaker[] | undefined;
  api.getSpeakers().subscribe((speakers) => (result = speakers));

  const req = httpTesting.expectOne(`${API_URL}/speakers`); // genau eine Anfrage an diese URL (inkl. Query)
  expect(req.request.method).toBe('GET');
  req.flush([{ id: 4, name: 'Mira Marble', company: 'RxLab', bio: '' }]); // Antwort liefern

  expect(result?.length).toBe(1);
});

it('reicht „nicht gefunden“ als Fehler weiter', () => {
  let error: HttpErrorResponse | undefined;
  api.getSession(42).subscribe({ error: (e: HttpErrorResponse) => (error = e) });

  httpTesting
    .expectOne(`${API_URL}/sessions/42`)
    .flush({ message: 'Session nicht gefunden' }, { status: 404, statusText: 'Not Found' });

  expect(error?.status).toBe(404);
});
```

| Methode | Wirkung |
| --- | --- |
| `expectOne(url)` | genau eine Anfrage mit dieser URL (inkl. Query-String), sonst Fehler |
| `expectOne((req) => …)` | Anfrage per Bedingung finden (Methode, Header, Body) |
| `expectNone(url)` | sicherstellen, dass keine Anfrage rausging |
| `req.request` | die abgefangene `HttpRequest` (`method`, `headers`, `params`, `body`) |
| `req.flush(body, { status, statusText })` | Antwort liefern; Status ≥ 400 löst den Fehlerweg aus |
| `httpTesting.verify()` | Test schlägt fehl, wenn Anfragen offen geblieben sind |

## Guard und Interceptor aus Lab 9.2 testen

Funktionale Guards und Interceptors rufen `inject()` auf. Im Test liefert `TestBed.runInInjectionContext()` den nötigen Kontext.

```ts
it('schickt Abgemeldete von /admin/users zum Login', () => {
  TestBed.configureTestingModule({ providers: [provideRouter([])] }); // Router für createUrlTree
  // kein setSession: Der AuthService startet abgemeldet

  const segments = [new UrlSegment('admin', {}), new UrlSegment('users', {})];
  const result = TestBed.runInInjectionContext(() =>
    adminGuard({ path: 'admin' }, segments, {} as PartialMatchRouteSnapshot),
  );

  expect(result).toBeInstanceOf(UrlTree);
  expect(TestBed.inject(Router).serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fadmin%2Fusers');
});
```

`CanMatchFn` hat in Angular 22 drei Parameter (Route, URL-Segmente, Teil-Snapshot); der Guard nutzt den dritten nicht, daher genügt ein leeres Objekt.

Interceptor: über `withInterceptors` einhängen und die abgefangene Anfrage prüfen.

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
});
TestBed.inject(AuthService).setSession('abc.def.ghi', user);
TestBed.inject(HttpClient).get('/favorites').subscribe();

const req = TestBed.inject(HttpTestingController).expectOne('/favorites');
expect(req.request.headers.get('Authorization')).toBe('Bearer abc.def.ghi');
```

## Aus Sicht der Nutzenden testen

Die Angular Testing Library (`@testing-library/angular`, nicht im Kurs-Repo installiert) sucht Elemente wie Nutzende: über Rolle und Text statt über CSS-Selektoren.

| Mit TestBed direkt | Mit Testing Library |
| --- | --- |
| `element.querySelector('button')!.click()` | `await userEvent.click(screen.getByRole('button', { name: /Merken/ }))` |
| `expect(h3.textContent).toContain('…')` | `expect(screen.getByText('Testen ohne Tränen')).toBeTruthy()` |

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| `NG0950: Input "session" is required but no value is available yet` | `input.required` nicht gesetzt, bevor gerendert wird | `setInput('session', …)` vor dem ersten `whenStable()` |
| `TS2540: Cannot assign to 'session' because it is a read-only property` | Signal-Input ist schreibgeschützt | `fixture.componentRef.setInput()` |
| DOM zeigt noch den alten Wert | nach Klick oder `setInput` nicht gewartet | `await fixture.whenStable()` |
| `Expected one matching request for criteria "…", found none` | URL inkl. Query stimmt nicht oder Subscribe fehlt | URL aus `req.request.urlWithParams` vergleichen; `.subscribe()` aufrufen |
| `NG0203: … inject() function must be called from an injection context` | Guard direkt aufgerufen | `TestBed.runInInjectionContext(() => guard(...))` |
| `No provider for HttpClient` | nur `provideHttpClientTesting()` angegeben | `provideHttpClient()` zusätzlich und davor |

## Fazit

- Komponenten werden über ihr DOM und ihre Signale geprüft; Inputs kommen per `setInput`, Aktualisierungen per `await fixture.whenStable()`.
- `provideHttpClientTesting` + `HttpTestingController` ersetzen den Server; `verify()` findet vergessene Anfragen.
- Funktionale Guards und Interceptors laufen im Test über `runInInjectionContext` bzw. `withInterceptors`.

Die Übung testet Session-Karte, `SessionApi` und (als Erweiterung) den Admin-Guard.
