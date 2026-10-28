// Login gegen die Mock-API und Token dekodieren – ohne externe Webseite.
// Aufruf (im Ordner output/project, Mock-API läuft):
//   node src/app/examples/m09-security/l01-tokens/decode-jwt.mjs user@eventhub.test user123
const [email = 'user@eventhub.test', password = 'user123'] = process.argv.slice(2);

const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
if (!response.ok) {
  console.error(`Login fehlgeschlagen: HTTP ${response.status}`);
  process.exit(1);
}

const { accessToken } = await response.json();
const [header, payload, signature] = accessToken.split('.');
const decode = (part) => JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
const claims = decode(payload);

console.log('Token:     ', accessToken);
console.log('Header:    ', decode(header));
console.log('Payload:   ', claims);
console.log('Signatur:  ', signature, '(nur mit dem Server-Schlüssel prüfbar)');
console.log('Ausgestellt:', new Date(claims.iat * 1000).toLocaleString('de-DE'));
console.log('Läuft ab:  ', new Date(claims.exp * 1000).toLocaleString('de-DE'));
