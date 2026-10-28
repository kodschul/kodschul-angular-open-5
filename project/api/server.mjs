// EventHub Mock-API – ohne Abhängigkeiten, nur Node.js-Bordmittel.
// Start: npm run api  (Port 3000, änderbar über PORT)
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { createHmac, randomInt } from 'node:crypto';

const PORT = Number(process.env.PORT ?? 3000);
const SECRET = 'eventhub-kurs-secret'; // nur für den Kurs, nie in echten Projekten
const db = JSON.parse(readFileSync(new URL('./db.json', import.meta.url), 'utf8'));

// Schalter für Übungen: per POST /_control oder pro Anfrage per Query (_delay, _randomDelay, _fail)
const control = { delay: 0, randomDelay: false, fail: 0 };

// ---------- JWT (HS256) ----------
const b64url = (input) => Buffer.from(input).toString('base64url');
function signJwt(payload, expiresInSec) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + expiresInSec }));
  const signature = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}
function verifyJwt(token) {
  const [header, body, signature] = token.split('.');
  if (!signature) return null;
  const expected = createHmac('sha256', SECRET).update(`${header}.${body}`).digest('base64url');
  if (expected !== signature) return null;
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  return payload.exp * 1000 > Date.now() ? payload : null;
}

// ---------- Hilfsfunktionen ----------
function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(data === undefined ? '' : JSON.stringify(data, null, 2));
}
async function readBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  return raw ? JSON.parse(raw) : {};
}
function currentUser(req) {
  const auth = req.headers.authorization ?? '';
  return auth.startsWith('Bearer ') ? verifyJwt(auth.slice(7)) : null;
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const withSpeaker = (session) => ({
  ...session,
  speaker: db.speakers.find((s) => s.id === session.speakerId) ?? null,
});

// ---------- Routen ----------
async function handle(req, res, url) {
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const q = url.searchParams;
  const user = currentUser(req);
  let match;

  if (req.method === 'POST' && path === '/_control') {
    Object.assign(control, await readBody(req));
    return send(res, 200, control);
  }
  if (req.method === 'GET' && path === '/_control') return send(res, 200, control);

  if (req.method === 'GET' && path === '/sessions') {
    const term = (q.get('q') ?? '').toLowerCase();
    const level = q.get('level');
    const track = q.get('track');
    const type = q.get('type');
    const result = db.sessions.filter(
      (s) =>
        (!term || s.title.toLowerCase().includes(term) || s.tags.some((t) => t.includes(term))) &&
        (!level || s.level === level) &&
        (!track || s.track === track) &&
        (!type || s.type === type),
    );
    return send(res, 200, result.map(withSpeaker));
  }
  if ((match = path.match(/^\/sessions\/(\d+)$/))) {
    const session = db.sessions.find((s) => s.id === Number(match[1]));
    if (!session) return send(res, 404, { message: 'Session nicht gefunden' });
    if (req.method === 'GET') return send(res, 200, withSpeaker(session));
    if (req.method === 'PATCH') {
      if (user?.role !== 'admin') return send(res, user ? 403 : 401, { message: 'Nur für Admins' });
      Object.assign(session, await readBody(req), { id: session.id });
      return send(res, 200, withSpeaker(session));
    }
  }

  if (req.method === 'GET' && path === '/speakers') return send(res, 200, db.speakers);
  if (req.method === 'GET' && (match = path.match(/^\/speakers\/(\d+)$/))) {
    const speaker = db.speakers.find((s) => s.id === Number(match[1]));
    return speaker ? send(res, 200, speaker) : send(res, 404, { message: 'Speaker nicht gefunden' });
  }

  if (path === '/registrations') {
    if (req.method === 'GET') {
      const email = (q.get('email') ?? '').toLowerCase();
      return send(res, 200, db.registrations.filter((r) => !email || r.email.toLowerCase() === email));
    }
    if (req.method === 'POST') {
      const body = await readBody(req);
      if (!body.email || !body.name) return send(res, 400, { message: 'name und email sind Pflicht' });
      const registration = { id: db.registrations.length + 1, ...body, createdAt: new Date().toISOString() };
      db.registrations.push(registration);
      return send(res, 201, registration);
    }
  }

  if (req.method === 'POST' && path === '/auth/login') {
    const { email, password, expiresIn } = await readBody(req);
    const found = db.users.find((u) => u.email === email && u.password === password);
    if (!found) return send(res, 401, { message: 'E-Mail oder Passwort falsch' });
    const profile = { sub: String(found.id), email: found.email, name: found.name, role: found.role };
    return send(res, 200, { accessToken: signJwt(profile, Number(expiresIn ?? 3600)), user: profile });
  }
  if (req.method === 'GET' && path === '/auth/me') {
    return user ? send(res, 200, user) : send(res, 401, { message: 'Nicht angemeldet oder Token abgelaufen' });
  }

  if (path === '/favorites') {
    if (!user) return send(res, 401, { message: 'Nicht angemeldet oder Token abgelaufen' });
    db.favorites[user.sub] ??= [];
    if (req.method === 'GET') return send(res, 200, db.favorites[user.sub]);
    if (req.method === 'PUT') {
      const { sessionIds } = await readBody(req);
      db.favorites[user.sub] = Array.isArray(sessionIds) ? sessionIds : [];
      return send(res, 200, db.favorites[user.sub]);
    }
  }

  if (req.method === 'GET' && path === '/admin/stats') {
    if (!user) return send(res, 401, { message: 'Nicht angemeldet oder Token abgelaufen' });
    if (user.role !== 'admin') return send(res, 403, { message: 'Nur für Admins' });
    const booked = db.sessions.reduce((sum, s) => sum + s.booked, 0);
    const capacity = db.sessions.reduce((sum, s) => sum + s.capacity, 0);
    return send(res, 200, {
      sessions: db.sessions.length,
      speakers: db.speakers.length,
      registrations: db.registrations.length,
      utilization: Math.round((booked / capacity) * 100),
    });
  }

  return send(res, 404, { message: `Unbekannte Route: ${req.method} ${path}` });
}

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return send(res, 204);

  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const delay = Number(url.searchParams.get('_delay') ?? control.delay);
  const randomDelay = url.searchParams.has('_randomDelay') || control.randomDelay;
  const fail = Number(url.searchParams.get('_fail') ?? control.fail);

  try {
    if (delay > 0) await sleep(delay);
    if (randomDelay) await sleep(randomInt(0, 1500));
    if (fail >= 400 && !url.pathname.startsWith('/_control')) {
      return send(res, fail, { message: `Simulierter Fehler ${fail}` });
    }
    await handle(req, res, url);
  } catch (error) {
    send(res, 500, { message: 'Interner Fehler', detail: String(error) });
  }
  console.log(`${req.method} ${req.url} -> ${res.statusCode}`);
}).listen(PORT, () => console.log(`EventHub Mock-API läuft auf http://localhost:${PORT}`));
