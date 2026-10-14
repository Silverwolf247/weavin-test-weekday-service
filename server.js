'use strict';
// REPLACES server.js on branch broken-start. Dies on every start, so the health check never passes.
process.stderr.write('fatal: config file /etc/weavin-test/missing.json not found\n');
process.exit(1);
