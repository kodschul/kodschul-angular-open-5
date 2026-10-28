// JWT lesen (nicht prüfen!): Header und Payload sind nur Base64URL-kodiertes JSON.

export interface JwtHeader {
  alg: string;
  typ: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  /** issued at: Ausstellungszeit in Sekunden seit 1970 */
  iat: number;
  /** expires: Ablaufzeit in Sekunden seit 1970 */
  exp: number;
}

/** Dekodiert einen Teil des Tokens (Header oder Payload). */
export function decodeJwtPart<T>(part: string): T {
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/'); // Base64URL -> Base64
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as T; // TextDecoder: Umlaute korrekt
}

export function decodeJwt(token: string): { header: JwtHeader; payload: JwtPayload; signature: string } {
  const [header, payload, signature] = token.split('.');
  return { header: decodeJwtPart<JwtHeader>(header), payload: decodeJwtPart<JwtPayload>(payload), signature };
}

/** true, wenn exp in der Vergangenheit liegt. Nur für die Anzeige – gültig ist, was der Server sagt. */
export function isExpired(token: string, now = Date.now()): boolean {
  return decodeJwt(token).payload.exp * 1000 <= now;
}
