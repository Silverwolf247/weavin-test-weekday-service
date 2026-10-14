'use strict';
const http = require('node:http');
const { randomBytes } = require('node:crypto');

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const BOOT_ID = randomBytes(4).toString('hex'); // changes on every process start
const NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function send(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(payload) });
  res.end(payload);
}

function weekday(dateStr) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(dateStr || '');
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = new Date(Date.UTC(y, mo - 1, d));
  if (t.getUTCFullYear() !== y || t.getUTCMonth() !== mo - 1 || t.getUTCDate() !== d) return null;
  const idx = t.getUTCDay();
  return {
    date: dateStr,
    weekday: NAMES[idx],
    isoWeekday: idx === 0 ? 7 : idx,
    isWeekend: idx === 0 || idx === 6,
    dayOfYear: Math.floor((t.getTime() - Date.UTC(y, 0, 0)) / 86400000),
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { status: 'ok' });
  if (req.method === 'GET' && url.pathname === '/boot') return send(res, 200, { bootId: BOOT_ID });
  if (req.method === 'GET' && url.pathname === '/weekday') {
    const out = weekday(url.searchParams.get('date'));
    return out ? send(res, 200, out) : send(res, 400, { error: 'date must be a valid YYYY-MM-DD' });
  }
  return send(res, 404, { error: 'not found' });
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`weekday service listening on ${HOST}:${PORT} boot=${BOOT_ID}\n`);
});
