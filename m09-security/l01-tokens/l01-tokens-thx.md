# Lab 9.1: Token-basierte Authentifizierung verstehen

**Leitfragen:**

<details>
<summary>Wie merkt sich eine Web-App, dass jemand angemeldet ist?</summary>

Nach dem Login bekommt der Browser einen Nachweis: entweder ein Cookie mit einer Sitzungs-ID, die der Server nachschlägt, oder ein Token, das die Angaben selbst enthält und bei jeder Anfrage mitgeschickt wird.

</details>

<details>
<summary>Was kann jemand anfangen, der ein fremdes Token in die Hände bekommt?</summary>

Alles, was die Besitzerin darf, bis das Token abläuft: Der Server prüft nur, ob das Token echt und gültig ist, nicht wer es schickt. Deshalb sind kurze Laufzeiten und ein sicherer Speicherort wichtig.

</details>

<details>
<summary>Warum reicht es nicht, den Admin-Button im Frontend auszublenden?</summary>

Der Frontend-Code läuft im Browser der Nutzenden und lässt sich ändern oder umgehen; jede Anfrage lässt sich auch ohne App senden (curl, DevTools). Nur der Server kann verbindlich entscheiden, wer was darf.

</details>

- Ein JWT ist lesbar, aber nicht änderbar: Header und Payload sind nur kodiert, die Signatur verrät jede Änderung.
- Der Client liest das Token für die Anzeige (Name, Rolle, Ablauf); vertrauen und entscheiden tut der Server.

## Begriffe

| Begriff | Bedeutung |
| --- | --- |
| Authentifizierung | Wer ist das? (Login prüft die Identität) |
| Autorisierung | Was darf diese Person? (Rolle, Rechte; entscheidet der Server pro Anfrage) |
| Session-Cookie | Cookie mit zufälliger Sitzungs-ID; der Server speichert die Sitzung |
| Token | Zeichenkette, die die Angaben zur Person selbst trägt; der Server speichert nichts |
| JWT (JSON Web Token) | Token-Format aus drei Base64URL-Teilen `header.payload.signature` |
| Claim | ein Eintrag in der Payload, z. B. `role` oder `exp` |
| Bearer-Token | Token im Header `Authorization: Bearer <token>`; wer es trägt („bearer“), gilt als berechtigt |
| Access-Token | kurzlebiges Token für API-Aufrufe (Minuten) |
| Refresh-Token | langlebiges Token, das nur gegen ein neues Access-Token getauscht wird |

## Session-Cookie oder Token

| | Session-Cookie | Token (JWT) |
| --- | --- | --- |
| Was der Browser hält | Sitzungs-ID | alle Angaben inkl. Ablauf und Signatur |
| Was der Server speichert | Sitzung pro Person | nur den Schlüssel zum Prüfen |
| Versand | automatisch bei jeder Anfrage an die Domain | durch den Client-Code im Header |
| Logout | Server löscht die Sitzung, sofort wirksam | Token gilt bis `exp`, außer der Server führt eine Sperrliste |
| Mehrere APIs/Domains | schwierig (Cookie gehört zu einer Domain) | einfach (Header an jede API) |
| Typisches Risiko | CSRF | Diebstahl per XSS, wenn das Token für JavaScript lesbar liegt |

Die EventHub-Mock-API arbeitet mit Tokens: `POST /auth/login` liefert ein JWT, geschützte Endpunkte (`/auth/me`, `/favorites`, `/admin/stats`) erwarten es im Header.

## Aufbau eines JWT

Echte Antwort der Mock-API (`npm run api`) auf den Login von `user@eventhub.test`:

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJ1c2VyQGV2ZW50aHViLnRlc3QiLCJuYW1lIjoiVWxpIFVzZXIiLCJyb2xlIjoidXNlciIsImlhdCI6MTc5MzIxNDc1MSwiZXhwIjoxNzkzMjE4MzUxfQ.Wn73oQnOW6F71WaWK_wvWouXKMUL1vEFvBKHWvQM4so
└──────────── Header ────────────┘ └──────────────────────────────── Payload ────────────────────────────────┘ └────── Signatur ──────┘
```

```jsonc
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload
{
  "sub": "2",                      // subject: ID der Person
  "email": "user@eventhub.test",
  "name": "Uli User",
  "role": "user",                  // eigener Claim der EventHub-API
  "iat": 1793214751,               // issued at: Sekunden seit 1970 -> 28.10.2026, 20:12:31
  "exp": 1793218351                // expires: 1 Stunde später
}
```

| Teil | Inhalt | Wer kann es lesen | Wer kann es erzeugen |
| --- | --- | --- | --- |
| Header | Algorithmus (`HS256` = HMAC mit SHA-256) | alle | alle |
| Payload | Claims | alle | alle |
| Signatur | HMAC über `header.payload` mit geheimem Schlüssel | – | nur wer den Schlüssel hat (Server) |

```mermaid
sequenceDiagram
  participant C as Browser (Angular)
  participant A as API
  C->>A: POST /auth/login { email, password }
  A-->>C: { accessToken, user }
  C->>A: GET /admin/stats  Authorization: Bearer <token>
  A->>A: Signatur prüfen, exp prüfen, role prüfen
  A-->>C: 200 Daten oder 401 / 403
```

## Lesen, nicht vertrauen

Header und Payload sind Base64URL: Base64 mit `-` und `_` statt `+` und `/`, ohne `=` am Ende. Dekodieren im Browser:

```ts
// src/app/examples/m09-security/l01-tokens/jwt.ts (Auszug)
export function decodeJwtPart<T>(part: string): T {
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/');       // Base64URL -> Base64
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as T;         // UTF-8, Umlaute korrekt
}
```

Gegenprobe aus dem Beispiel `/examples/m09-security/l01-tokens`: Die Payload wird mit `"role": "admin"` neu kodiert, die Signatur bleibt.

| Anfrage `GET /admin/stats` | Antwort der Mock-API |
| --- | --- |
| echtes Token, Rolle `user` | `403 {"message": "Nur für Admins"}` |
| Payload auf `admin` geändert | `401 {"message": "Nicht angemeldet oder Token abgelaufen"}` (Signatur passt nicht) |
| echtes Token, Rolle `admin` | `200 {"sessions": 12, "speakers": 6, "registrations": 1, "utilization": 66}` |

Folgen für den Client: Rolle und Ablauf aus dem Token steuern nur die Anzeige (Admin-Link zeigen, „Sitzung läuft ab“). Ein Token nie im Client „prüfen“ und daraus Rechte ableiten; den Schlüssel kennt nur der Server.

## Wo liegt das Token?

| Speicherort | Übersteht Neuladen | Lesbar für JavaScript (XSS) | Automatisch mitgeschickt (CSRF) |
| --- | --- | --- | --- |
| Variable / Signal im Speicher | nein | ja, solange die Seite läuft | nein |
| `sessionStorage` | ja, nur in diesem Tab | ja | nein |
| `localStorage` | ja, alle Tabs, dauerhaft | ja | nein |
| Cookie `HttpOnly; Secure; SameSite` (vom Server gesetzt) | ja | nein | ja, `SameSite` begrenzt das |

- XSS (Cross-Site Scripting): fremdes JavaScript läuft in der App und liest alles, was JavaScript lesen kann.
- CSRF (Cross-Site Request Forgery): eine fremde Seite löst eine Anfrage aus, und der Browser hängt Cookies automatisch an.
- Kurze Laufzeit des Access-Tokens begrenzt den Schaden; Refresh-Tokens gehören nicht in JavaScript-lesbaren Speicher.

## Eingebaute Schutzmechanismen von Angular

| Mechanismus | Wirkung |
| --- | --- |
| Interpolation `{{ wert }}` | gibt Text aus, nie HTML; `<script>` erscheint als Text |
| `[innerHTML]`, `[href]`, `[style]` | Angular bereinigt Werte (Sanitizing) und warnt in der Konsole, wenn es etwas entfernt |
| `DomSanitizer.bypassSecurityTrust…()` | schaltet die Bereinigung ab; nur für geprüfte, eigene Inhalte |
| `HttpClient`-XSRF (in `provideHttpClient` aktiv) | liest das Cookie `XSRF-TOKEN` und sendet es als Header `X-XSRF-TOKEN`, nur bei schreibenden Anfragen an die eigene Origin; der Server muss beides vergleichen |

## Grundsatz: Autorisierung entscheidet der Server

| Ebene | Aufgabe |
| --- | --- |
| Frontend (Angular) | gute Bedienung: Links ausblenden, Routen sperren, zum Login leiten |
| Backend (API) | Sicherheit: Token prüfen, Rolle prüfen, `401`/`403` senden |

`401 Unauthorized` heißt „nicht angemeldet oder Token ungültig“, `403 Forbidden` „angemeldet, aber nicht berechtigt“.

## Typische Fehler

| Symptom | Ursache | Lösung |
| --- | --- | --- |
| `atob` meldet „The string to be decoded is not correctly encoded“ | Base64URL-Zeichen `-`/`_` nicht ersetzt oder ganzes Token statt eines Teils dekodiert | `split('.')`, dann `-`→`+`, `_`→`/` |
| Umlaute im Namen kaputt | `atob` liefert Bytes, nicht UTF-8-Text | `TextDecoder` wie im Beispiel |
| Ablaufzeit im Jahr 1970 | `exp` in Sekunden als Millisekunden verwendet | `exp * 1000` für `Date` |
| `401` statt `403` mit eigenem Token | Token abgelaufen (Standard 1 h) | neu anmelden |

## Vertiefung

- jwt.io zeigt Tokens ebenfalls dekodiert an; das Token wird dafür in eine fremde Webseite kopiert. Für echte Tokens ist ein lokales Skript wie `decode-jwt.mjs` die sicherere Wahl.
- Asymmetrische Verfahren (`RS256`, `ES256`) signieren mit einem privaten Schlüssel; Clients und andere Server prüfen mit einem öffentlichen. So arbeiten OIDC-Server wie Keycloak.

## Fazit

- Ein JWT besteht aus Header, Payload und Signatur; die ersten beiden sind lesbar, die Signatur schützt vor Änderung.
- Der Client liest Claims für die Anzeige; Rechte prüft der Server bei jeder Anfrage.
- Speicherort ist eine Abwägung zwischen XSS, CSRF und Komfort.

Die Übung holt ein Token von der Mock-API, dekodiert es per Skript und im Browser und begründet den Speicherort für EventHub.
