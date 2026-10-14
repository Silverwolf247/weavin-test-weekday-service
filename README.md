# weavin-test-weekday-service

A tiny long-running HTTP service (Node.js, no third-party dependencies) that tells you which day of the week a calendar date falls on. Deterministic, no network access, no API keys, no database.

## Start
```
npm start
```
(runs `node server.js`). The server listens on the `PORT` environment variable (default 3000) and binds to `HOST` (default 0.0.0.0). Requires Node.js 18 or newer. Nothing to install.

## Endpoints (all GET, all return JSON)

### GET /health
Health check. Returns `{"status":"ok"}` with HTTP 200 once the server is up.

### GET /weekday?date=YYYY-MM-DD
Query parameter `date` (required): a valid calendar date, ISO format, interpreted in UTC.
Response: `date`, `weekday` (English name), `isoWeekday` (1 = Monday ... 7 = Sunday), `isWeekend`, `dayOfYear`.
An invalid or missing date returns HTTP 400 with `{"error":"date must be a valid YYYY-MM-DD"}`.

| Request | Response |
|---|---|
| `/weekday?date=2026-01-01` | `{"date":"2026-01-01","weekday":"Thursday","isoWeekday":4,"isWeekend":false,"dayOfYear":1}` |
| `/weekday?date=2000-01-01` | `{"date":"2000-01-01","weekday":"Saturday","isoWeekday":6,"isWeekend":true,"dayOfYear":1}` |
| `/weekday?date=2024-02-29` | `{"date":"2024-02-29","weekday":"Thursday","isoWeekday":4,"isWeekend":false,"dayOfYear":60}` |
| `/weekday?date=2023-02-29` | HTTP 400 (not a real date) |

### GET /boot
Returns `{"bootId":"<8 hex chars>"}`. The id is random and changes every time the process starts. It is NOT deterministic; do not use it for smoke-test assertions.
