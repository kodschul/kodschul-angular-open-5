# Lab 9.1 – Lösung: Token-basierte Authentifizierung verstehen

Fertiges Beispiel: `src/app/examples/m09-security/l01-tokens/` (`example.ts`, `jwt.ts`, `decode-jwt.mjs`), im Browser unter `/examples/m09-security/l01-tokens`.

## Aufgabe 1: Token per Skript

```bash
node src/app/examples/m09-security/l01-tokens/decode-jwt.mjs user@eventhub.test user123
```

```text
Token:      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwi…
Header:     { alg: 'HS256', typ: 'JWT' }
Payload:    {
  sub: '2',
  email: 'user@eventhub.test',
  name: 'Uli User',
  role: 'user',
  iat: 1793214751,
  exp: 1793218351
}
Signatur:   Wn73oQnOW6F71WaWK_wvWouXKMUL1vEFvBKHWvQM4so (nur mit dem Server-Schlüssel prüfbar)
Ausgestellt: 28.10.2026, 20:12:31
Läuft ab:   28.10.2026, 21:12:31
```

Zeiten und Signatur ändern sich bei jedem Login; `exp − iat` ist immer 3600 Sekunden.

## Aufgabe 2: Admin und falsches Passwort

| Aufruf | Ergebnis |
| --- | --- |
| `admin@eventhub.test admin123` | `sub: '1'`, `name: 'Alex Admin'`, `role: 'admin'`, sonst gleicher Aufbau |
| falsches Passwort | `Login fehlgeschlagen: HTTP 401` |

Die Rolle steht im Token. Wer die Payload liest, erfährt sie; ändern lässt sie sich nicht unbemerkt (Signatur).

## Aufgaben 3 und 4: Dekodieren und anzeigen

```ts
// src/app/playground/playground.ts
import { DatePipe, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { API_URL } from '../shared/api';
import { LoginResponse } from '../shared/models';

interface Claims {
  sub: string;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

function decodePart(part: string): unknown {
  if (!part) return null;
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

@Component({
  selector: 'app-playground',
  imports: [JsonPipe, DatePipe],
  template: `
    <h1>Token lesen</h1>
    <div class="row">
      <button class="btn btn-primary" (click)="login('user@eventhub.test', 'user123')">Login als User</button>
      <button class="btn" (click)="login('admin@eventhub.test', 'admin123')">Login als Admin</button>
    </div>
    @if (token()) {
      <p style="word-break: break-all"><code>{{ token() }}</code></p>
      <div class="grid">
        <section class="card"><h3>Header</h3><pre>{{ header() | json }}</pre></section>
        <section class="card"><h3>Payload</h3><pre>{{ payload() | json }}</pre></section>
      </div>
      @if (claims(); as c) {
        <section class="card">
          <p>Rolle: <span class="badge">{{ c.role }}</span></p>
          <p>Ausgestellt: {{ c.iat * 1000 | date: 'dd.MM.yyyy HH:mm:ss' }}</p>
          <p>Läuft ab: {{ c.exp * 1000 | date: 'dd.MM.yyyy HH:mm:ss' }}</p>
        </section>
      }
    }
    <section class="card">
      <h3>Speicherort für EventHub: sessionStorage</h3>
      <p>
        Das Access-Token liegt im sessionStorage, weil es ein Neuladen im selben Tab übersteht und beim Schließen des Tabs verschwindet.
        Ein Cookie wäre vor XSS besser geschützt, müsste aber vom Server als HttpOnly gesetzt und gegen CSRF abgesichert werden; die Mock-API liefert das Token im JSON.
        Das Restrisiko XSS begrenzen die kurze Laufzeit von einer Stunde und Angulars Sanitizing.
      </p>
    </section>
  `,
})
export class Playground {
  private readonly http = inject(HttpClient);
  protected readonly token = signal('');
  protected readonly header = computed(() => decodePart(this.token().split('.')[0] ?? ''));
  protected readonly payload = computed(() => decodePart(this.token().split('.')[1] ?? ''));
  protected readonly claims = computed(() => this.payload() as Claims | null);

  login(email: string, password: string): void {
    this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, { email, password })
      .subscribe((res) => this.token.set(res.accessToken));
  }
}
```

| Detail | Grund |
| --- | --- |
| `-`→`+`, `_`→`/` | `atob` kennt nur Standard-Base64 |
| `TextDecoder` | `atob` liefert ein Zeichen pro Byte; Umlaute bestehen in UTF-8 aus zwei Bytes |
| `* 1000` | `iat`/`exp` sind Sekunden, `Date` und die `date`-Pipe erwarten Millisekunden |
| fehlendes `=` am Ende | `atob` ergänzt die Auffüllung selbst |

## Aufgabe 5: Konsole

```js
JSON.parse(atob('eyJzdWIiOiIyIiwiZW1haWwiOiJ1c2VyQGV2ZW50aHViLnRlc3QiLCJuYW1lIjoiVWxpIFVzZXIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc5MzIxNDc1MSwiZXhwIjoxNzkzMjE4MzUxfQ'.replace(/-/g, '+').replace(/_/g, '/')))
// {sub: '2', email: 'user@eventhub.test', name: 'Uli User', role: 'user', iat: 1793214751, exp: 1793218351}
```

## Aufgabe 6: Begründung des Speicherorts

Musterbegründung (sessionStorage) steht im Template oben. Andere Entscheidungen sind gültig, wenn sie die Abwägung benennen:

| Entscheidung | Tragfähige Begründung |
| --- | --- |
| nur im Speicher (Signal) | kein Rest nach Schließen oder Neuladen; Preis: nach jedem Neuladen neu anmelden |
| `sessionStorage` | übersteht Neuladen, nicht tab-übergreifend; XSS-Risiko bleibt, kurze Laufzeit begrenzt es |
| `localStorage` | bequem über Tabs und Neustarts; längstes Zeitfenster für Diebstahl per XSS, für EventHub zu großzügig |
| `HttpOnly`-Cookie | für JavaScript unlesbar; braucht Server-Unterstützung und CSRF-Schutz (`SameSite`, XSRF-Header) |

Lab 9.2 setzt `sessionStorage` um.

## Erweiterung

Siehe `callAdmin()` und `forgedToken` in `src/app/examples/m09-security/l01-tokens/example.ts`.

| Anfrage `GET /admin/stats` | Ergebnis |
| --- | --- |
| Token von `user@eventhub.test` | `403 Nur für Admins` |
| gleiches Token, Rolle in der Payload auf `admin` geändert | `401 Nicht angemeldet oder Token abgelaufen` |
| Token von `admin@eventhub.test` | `200` mit `sessions`, `speakers`, `registrations`, `utilization` |

Die Fälschung scheitert an der Signatur: Der Server berechnet sie über die geänderte Payload neu, und das Ergebnis passt nicht.
