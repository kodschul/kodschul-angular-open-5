# Vorbereitung: Angular-Grundlagen auffrischen

Optionale Auffrischung vor Tag 1. Der Kurs setzt diese Grundlagen voraus und wiederholt sie in Lab 1.2 nur als Diagnose-Übung. Die Beispiele nutzen bewusst die klassische Schreibweise, wie sie in vielen Bestandsprojekten steht; der Kurs zeigt danach den heutigen Weg.

Bearbeitungszeit: ca. 60–90 Minuten. Die Übungen laufen im Kurs-Projekt (`project/`, siehe [`00-setup-and-installation.md`](00-setup-and-installation.md)) in `src/app/playground/playground.ts`.

## Checkliste

| Thema | Sollte sitzen | Abschnitt |
| --- | --- | --- |
| TypeScript | Interfaces, Union-Typen, Generics lesen, `readonly`, optionale Felder | 1 |
| Komponenten | Klasse + Template, Selektor, `imports` | 2 |
| Datenbindung | Interpolation, Property-, Event-, Zwei-Wege-Bindung | 2 |
| Komponenten-Kommunikation | `@Input`, `@Output` + `EventEmitter` | 3 |
| Services und Dependency Injection | `@Injectable`, `providedIn: 'root'`, Konstruktor-Injection | 4 |
| HTTP und RxJS | `HttpClient`, `Observable`, `subscribe`, `map`, `filter`, `async`-Pipe | 5 |
| Routing | Routen, `routerLink`, `router-outlet`, Parameter lesen | 6 |
| Pipes | `date`, `currency`, `uppercase`, eigene Pipe | 2 |

## 1. TypeScript, das Angular voraussetzt

```ts
type Level = 'Einsteiger' | 'Fortgeschritten' | 'Experte'; // Union-Typ: nur diese drei Werte

interface Session {
  readonly id: number;   // darf nach dem Anlegen nicht geändert werden
  title: string;
  level: Level;
  tags: string[];
  speaker?: string;      // optional
}

function byLevel<T extends { level: Level }>(items: T[], level: Level): T[] {
  return items.filter((item) => item.level === level); // Generic: funktioniert für jeden Typ mit "level"
}
```

**Übung 1:** Ergänze ein Interface `Speaker` (`id`, `name`, `company`) und eine Funktion `titles(sessions: Session[]): string[]`, die nur die Titel zurückgibt.

<details>
<summary>Lösung Übung 1</summary>

```ts
interface Speaker { id: number; name: string; company: string; }
const titles = (sessions: Session[]): string[] => sessions.map((s) => s.title);
```

</details>

## 2. Komponenten, Bindungen und Pipes

| Bindung | Syntax | Richtung |
| --- | --- | --- |
| Interpolation | `{{ session.title }}` | Klasse → Template |
| Property Binding | `[disabled]="isFull"` | Klasse → DOM-Eigenschaft |
| Event Binding | `(click)="book()"` | DOM-Ereignis → Klasse |
| Zwei-Wege-Bindung | `[(ngModel)]="term"` (benötigt `FormsModule`) | beide Richtungen |

```ts
import { Component } from '@angular/core';
import { DatePipe, NgFor, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-playground',
  imports: [NgFor, DatePipe, UpperCasePipe],
  template: `
    <h1>{{ title | uppercase }}</h1>
    <p>Stand: {{ today | date: 'dd.MM.yyyy' }}</p>
    <ul>
      <li *ngFor="let s of sessions">{{ s }}</li>
    </ul>
    <button class="btn" (click)="add()">Session hinzufügen</button>
  `,
})
export class Playground {
  title = 'EventHub';
  today = new Date();
  sessions = ['Angular heute', 'RxJS-Operatoren'];
  add() {
    this.sessions = [...this.sessions, `Neue Session ${this.sessions.length + 1}`];
  }
}
```

**Übung 2:** Ergänze einen Button „Leeren“, der deaktiviert ist (`[disabled]`), wenn die Liste leer ist.

<details>
<summary>Lösung Übung 2</summary>

```html
<button class="btn" [disabled]="sessions.length === 0" (click)="sessions = []">Leeren</button>
```

</details>

## 3. Eltern und Kind: `@Input` und `@Output`

```ts
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-session-item',
  template: `<span>{{ title }}</span> <button class="btn" (click)="remove.emit(title)">x</button>`,
})
export class SessionItem {
  @Input({ required: true }) title!: string;     // Daten nach unten
  @Output() remove = new EventEmitter<string>(); // Ereignisse nach oben
}
```

Verwendung im Eltern-Template: `<app-session-item [title]="s" (remove)="onRemove($event)" />`, dazu `SessionItem` in `imports` eintragen.

**Übung 3:** Baue `SessionItem` in den Playground ein; `onRemove` entfernt den Eintrag aus `sessions`.

<details>
<summary>Lösung Übung 3</summary>

```ts
onRemove(title: string) {
  this.sessions = this.sessions.filter((s) => s !== title);
}
```

</details>

## 4. Services und Dependency Injection

```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' }) // eine Instanz für die ganze App
export class GreetingService {
  greet(name: string) {
    return `Willkommen, ${name}!`;
  }
}

// In einer Komponente (klassisch per Konstruktor):
// constructor(private readonly greeting: GreetingService) {}
```

Lab 1.2 zeigt die heute übliche Schreibweise mit `inject()`.

## 5. HTTP und RxJS-Grundlagen

```ts
import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Session } from '../shared/models';

@Component({
  selector: 'app-playground',
  imports: [AsyncPipe, NgFor],
  template: `<li *ngFor="let t of titles$ | async">{{ t }}</li>`,
})
export class Playground {
  titles$: Observable<string[]>;
  constructor(http: HttpClient) {
    this.titles$ = http
      .get<Session[]>('http://localhost:3000/sessions')
      .pipe(map((sessions) => sessions.map((s) => s.title)));
  }
}
```

- Ein `Observable` liefert Werte über die Zeit; ohne Abonnement passiert nichts.
- `pipe(map(...), filter(...))` verändert die Werte, bevor sie ankommen.
- Die `async`-Pipe abonniert im Template und beendet das Abonnement automatisch.

**Übung 4:** Zeige nur Sessions mit `type === 'workshop'` an (Mock-API muss laufen: `npm run api`).

<details>
<summary>Lösung Übung 4</summary>

```ts
map((sessions) => sessions.filter((s) => s.type === 'workshop').map((s) => s.title))
```

</details>

## 6. Routing

```ts
// Routen-Definition
export const routes: Routes = [
  { path: '', component: SessionList },
  { path: 'sessions/:id', component: SessionDetail },
  { path: '**', redirectTo: '' },
];

// Parameter klassisch lesen
// constructor(route: ActivatedRoute) {
//   this.id$ = route.paramMap.pipe(map((params) => Number(params.get('id'))));
// }
```

Im Template: `<a [routerLink]="['/sessions', s.id]">Details</a>` und an der Stelle der Seiteninhalte `<router-outlet />`.

## Selbsteinschätzung

| Aussage | Wenn unsicher |
| --- | --- |
| Die vier Bindungsarten lassen sich ohne Nachschlagen schreiben. | Abschnitt 2 |
| Ein Kind meldet ein Ereignis an das Eltern-Element. | Abschnitt 3 |
| Ein Service liefert Daten per `HttpClient`, die Komponente zeigt sie per `async`-Pipe. | Abschnitt 5 |
| Eine Detailseite liest die ID aus der URL. | Abschnitt 6 |
