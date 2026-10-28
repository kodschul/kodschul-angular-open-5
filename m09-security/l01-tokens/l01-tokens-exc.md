# Lab 9.1 – Übung: Token-basierte Authentifizierung verstehen

**Dauer:** ca. 15 Minuten (zu zweit oder allein)
**Ändert die EventHub-Projektbasis?** Nein — die Übung liest Tokens und hält eine Entscheidung fest; Lab 9.2 setzt sie um.

## Vorbereitung

- Terminal 1 im Ordner `output/project/`: `npm run api`.
- Terminal 2 im Ordner `output/project/`: `npm start`.
- Terminal 3 im Ordner `output/project/` für Skripte.
- Arbeitsdatei: `src/app/playground/playground.ts`
- Starter: `src/app/starters/m09-l01-tokens.ts`
- Skript: `src/app/examples/m09-security/l01-tokens/decode-jwt.mjs`
- Browser: http://localhost:4200/playground

## Aufgaben

1. Führe in Terminal 3 `node src/app/examples/m09-security/l01-tokens/decode-jwt.mjs user@eventhub.test user123` aus. Notiere Header, die Claims der Payload und die Ablaufzeit.
2. Führe das Skript für `admin@eventhub.test` / `admin123` und einmal mit falschem Passwort aus. Notiere die Unterschiede.
3. Kopiere den Starter nach `src/app/playground/playground.ts`. Implementiere `decodePart`: Base64URL nach Base64 umwandeln, mit `atob` dekodieren, mit `JSON.parse` in ein Objekt wandeln.
4. Zeige unter den beiden Karten Rolle, Ausstellungszeit (`iat`) und Ablaufzeit (`exp`) lesbar an (`date`-Pipe, `exp` in Millisekunden umrechnen).
5. Öffne die DevTools-Konsole und dekodiere die Payload eines Tokens dort direkt: `JSON.parse(atob('<payload-teil>'.replace(/-/g, '+').replace(/_/g, '/')))`.
6. Entscheide den Speicherort des Tokens für EventHub (Speicher, `sessionStorage`, `localStorage` oder `HttpOnly`-Cookie) und schreibe die Begründung in drei Sätzen in das Template (an der Stelle `TODO 6`). Beziehe XSS, CSRF und das Verhalten beim Neuladen ein.

## Checkpoint

- Das Skript zeigt `alg: 'HS256'` und Claims `sub`, `email`, `name`, `role`, `iat`, `exp`; `exp` liegt eine Stunde nach `iat`.
- Falsches Passwort: `Login fehlgeschlagen: HTTP 401`.
- Der Playground zeigt Header und Payload als formatiertes JSON und die Rolle des gewählten Kontos.

## Abschlusskriterien

- Dekodiertes Token (Header, Payload, Ablaufzeit) ist im Playground sichtbar.
- Begründung des Speicherorts in drei Sätzen steht im Template.

## Erweiterung (optional)

- Ergänze einen Button, der `GET http://localhost:3000/admin/stats` mit dem Token im Header `Authorization: Bearer …` aufruft, und zeige Status und Antwort.
- Ändere im Token die Rolle auf `admin` (Payload neu kodieren, Signatur unverändert) und rufe `/admin/stats` damit auf. Notiere den Statuscode.

## Fallback

- Fertiges Beispiel mit Gegenprobe: http://localhost:4200/examples/m09-security/l01-tokens
- Ohne Node-Skript: Token aus dem Network-Tab (Antwort von `/auth/login`) kopieren und wie in Aufgabe 5 in der Konsole dekodieren. jwt.io ist eine Alternative; dort nur Kurs-Tokens einfügen, nie echte.
