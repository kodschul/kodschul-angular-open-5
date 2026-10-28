// Erzeugt das Hero-Bild der Startseite lokal als PNG (keine fremden Bilder, keine Abhängigkeiten).
// Aufruf: node scripts/generate-hero.mjs --width 2400 --height 1200 --noise 5 [--out public/img/hero.png] [--force]
// Das Rauschen (--noise) steuert, wie schlecht sich das Bild komprimieren lässt: mehr Rauschen = größere Datei.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { deflateSync } from 'node:zlib';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => (arg.startsWith('--') ? [...pairs, [arg.slice(2), all[i + 1]]] : pairs), []),
);
const width = Number(args.width ?? 2400);
const height = Number(args.height ?? 1200);
const noise = Number(args.noise ?? 5);
const out = args.out ?? 'public/img/hero.png';

// Schon vorhanden? Dann nichts tun (spart Zeit bei npm start/build). --force erzeugt neu.
if (existsSync(out) && !process.argv.includes('--force')) process.exit(0);

// Deterministischer Zufall, damit jede Erzeugung dieselbe Datei liefert.
let seed = 42;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 0x100000000);

const raw = Buffer.alloc((width * 3 + 1) * height);
for (let y = 0; y < height; y++) {
  const row = y * (width * 3 + 1);
  for (let x = 0; x < width; x++) {
    const fx = x / width;
    const fy = y / height;
    // Motiv: Abendhimmel über einer Bühne mit drei Scheinwerferkegeln
    let r = 40 + 150 * fy + 40 * fx;
    let g = 20 + 60 * fy;
    let b = 90 + 80 * (1 - fy);
    for (const cx of [0.25, 0.5, 0.75]) {
      const beam = Math.max(0, 1 - Math.abs(fx - cx) / (0.04 + 0.12 * fy)) * (fy < 0.75 ? 1 : 0);
      r += 120 * beam;
      g += 110 * beam;
      b += 60 * beam;
    }
    if (fy > 0.75) {
      // Bühne
      r = 30 + 20 * fx;
      g = 22;
      b = 40;
    }
    const n = () => (random() * 2 - 1) * noise;
    const i = row + 1 + x * 3;
    raw[i] = Math.max(0, Math.min(255, r + n()));
    raw[i + 1] = Math.max(0, Math.min(255, g + n()));
    raw[i + 2] = Math.max(0, Math.min(255, b + n()));
  }
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8; // Bit-Tiefe
ihdr[9] = 2; // RGB
// PNG-Filter "Sub" (Differenz zum linken Pixel): glatte Verläufe komprimieren damit gut, Rauschen nicht.
for (let y = 0; y < height; y++) {
  const row = y * (width * 3 + 1);
  raw[row] = 1;
  for (let i = width * 3; i >= 4; i--) raw[row + i] = (raw[row + i] - raw[row + i - 3]) & 0xff;
}

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, png);
console.log(`Hero-Bild erzeugt: ${out} (${width}x${height}, ${(png.length / 1024 / 1024).toFixed(1)} MB)`);
