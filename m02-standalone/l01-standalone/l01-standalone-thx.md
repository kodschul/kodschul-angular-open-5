# Lab 2.1: Standalone statt NgModule

**Leitfragen:**

<details>
<summary>Woher weiß eine Komponente in einem großen Projekt, welche anderen Komponenten sie verwenden darf?</summary>

Mit NgModules aus dem Modul, das sie deklariert, und allem, was dieses Modul importiert, oft über mehrere Ebenen. Standalone steht die Antwort in der Komponente selbst: in ihrem `imports`-Array.

</details>

<details>
<summary>Was passiert, wenn ein SharedModule 40 Einträge hat?</summary>

Jede Komponente, die es importiert, bekommt alle 40, auch wenn sie zwei braucht. Abhängigkeiten werden unsichtbar, Lazy-Loading-Chunks wachsen, und niemand traut sich, einen Eintrag zu entfernen.

</details>

<details>
<summary>Welche Vorteile hatte das Modulsystem trotzdem?</summary>

Gemeinsame Bausteine ließen sich mit einem Import bündeln, Provider und Routen an einer Stelle sammeln und Features als Einheit lazy laden. Bündeln geht standalone weiterhin, z. B. mit einem exportierten Array.

</details>

- Seit Angular 19 ist jede Komponente, Direktive und Pipe standardmäßig standalone; `standalone: false` markiert Altcode.
- Standalone-Bausteine und NgModules lassen sich mischen: Migration ist Schritt für Schritt möglich.

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| `NgModule` | Klasse mit `@NgModule`, die Komponenten deklariert und anderen Modulen bereitstellt |
| `declarations` | Liste der Bausteine, die zu einem Modul gehören; jeder Baustein in genau einem Modul |
| Kompilierungskontext | die Menge an Komponenten, Direktiven und Pipes, die ein Template verwenden darf |
| `SharedModule` | Konvention: ein Modul, das gemeinsame Bausteine (und oft `CommonModule`) exportiert |
| `CommonModule` | Modul mit `NgIf`, `NgFor`, `NgClass`, `AsyncPipe`, `DatePipe` u. a.; standalone werden diese einzeln importiert |

## Wozu NgModule gedacht war

| Aufgabe | NgModule | Standalone |
| --- | --- | --- |
| Kompilierungskontext | `declarations` + `imports` des Moduls | `imports` der Komponente |
| Provider | `providers` im Modul | `providers` in `app.config.ts`, an der Route oder `providedIn: 'root'` |
| Lazy Loading | `loadChildren: () => import(...).then(m => m.FeatureModule)` | `loadComponent` oder `loadChildren` mit Routen-Datei |
| Bündeln | `exports` eines SharedModule | exportiertes Array, z. B. `export const SESSION_UI = [LevelBadge, DurationPipe] as const;` |
| Start | `bootstrapModule(AppModule)` | `bootstrapApplication(App, appConfig)` (Lab 2.2) |

Bild dazu (aus Lab 1.1): Das `SharedModule` ist ein Gemeinschaftsschrank, aus dem jede importierende Komponente alles bekommt. Standalone packt jede Komponente ihren eigenen Koffer: Ihr `imports`-Array enthält genau das, was ihr Template verwendet.

## Vorher: Baustein im SharedModule

```ts
// level-badge.ts
@Component({
  selector: 'app-level-badge',
  standalone: false,                     // gehört zu einem NgModule
  template: `<span class="badge" [ngClass]="cssClass">{{ level }}</span>`,
})
export class LevelBadge { @Input({ required: true }) level!: SessionLevel; /* … */ }

// shared.module.ts
@NgModule({
  declarations: [LevelBadge, DurationPipe, SpeakerChip],
  imports: [CommonModule],               // liefert ngClass für die deklarierten Bausteine
  exports: [CommonModule, LevelBadge, DurationPipe, SpeakerChip],
})
export class SharedModule {}

// Verwender
@Component({ imports: [SharedModule], … })   // bekommt alles, auch CommonModule
```

## Nachher: Baustein standalone

```ts
// level-badge.ts
@Component({
  selector: 'app-level-badge',
  imports: [NgClass],                    // eigene Abhängigkeit, kein CommonModule
  template: `<span class="badge" [ngClass]="cssClass">{{ level }}</span>`,
})
export class LevelBadge { /* unverändert */ }

// duration.pipe.ts
@Pipe({ name: 'duration' })              // standalone ist Default
export class DurationPipe implements PipeTransform { /* … */ }

// Verwender
@Component({ imports: [LevelBadge, DurationPipe], … })
```

Schritte je Baustein:

1. `standalone: false` entfernen.
2. Was das eigene Template braucht, in `imports` des Bausteins eintragen (`NgClass`, andere Komponenten).
3. Aus `declarations` und `exports` des Moduls entfernen.
4. Bei jedem Verwender in `imports` eintragen.

## Mischbetrieb

| Kombination | Erlaubt? | Schreibweise |
| --- | --- | --- |
| Standalone-Komponente nutzt NgModule | ja | `imports: [SharedModule]` |
| NgModule nutzt Standalone-Komponente | ja | in `imports` des Moduls (nicht `declarations`), ggf. auch in `exports` |
| Standalone-Komponente in `declarations` | nein | Fehler `NG6008: … is standalone, and cannot be declared in an NgModule` |
| Komponente mit `standalone: false` direkt in `imports` einer Komponente | nein | nur über ihr Modul |

Übergangsweise kann ein SharedModule einen Standalone-Baustein importieren und wieder exportieren. Dann ändern sich die Verwender noch nicht.

> **Merksatz:** Standalone heißt: Jedes Template sieht genau das, was in seinem `imports`-Array steht.

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| `NG6008: Component LevelBadge is standalone, and cannot be declared in an NgModule. Did you mean to import it instead?` | `standalone: false` entfernt, aber noch in `declarations` | aus `declarations` entfernen, ggf. in `imports`/`exports` |
| `Can't bind to 'ngClass' since it isn't a known property of 'span'` | `NgClass` kam vorher über `CommonModule` des Moduls | `NgClass` in `imports` des Bausteins |
| `NG8004: No pipe found with name 'duration'` | Verwender importiert die Pipe nicht mehr über das Modul | `DurationPipe` in `imports` des Verwenders |
| `NG8004: No pipe found with name 'async'` nach Entfernen von `SharedModule` | `AsyncPipe` kam versteckt über `CommonModule` | `AsyncPipe` direkt importieren |
| `'app-level-badge' is not a known element` | Verwender importiert die Komponente nicht | in `imports` eintragen |

## Fazit

- NgModules lieferten Kompilierungskontext, Provider und Lazy Loading; standalone übernehmen das `imports`, `app.config.ts` und Routen.
- Ein Baustein wird standalone, indem er `standalone: false` verliert und seine Abhängigkeiten selbst importiert.
- Mischbetrieb erlaubt Migration Baustein für Baustein.

Die Übung löst eine Komponente und eine Pipe aus einem SharedModule und nutzt sie an zwei Stellen standalone.
