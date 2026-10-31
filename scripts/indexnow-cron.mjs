#!/usr/bin/env node
/*
 * The Railway cron service's start command: asks the web service to ping
 * IndexNow with any sitemap URLs that changed, then exits (Railway cron
 * services must finish and exit).
 *
 *   INDEXNOW_URL  the web service's /api/indexnow, e.g.
 *                 http://${{web.RAILWAY_PRIVATE_DOMAIN}}:${{web.PORT}}/api/indexnow
 *   CRON_SECRET   the same secret the web service has (${{web.CRON_SECRET}})
 *
 * The web service decides whether anything is sent: it does nothing until
 * INDEXNOW_ENABLED=true is set on it. Exits non-zero on any failure so the
 * run shows as failed in Railway.
 */

const url = process.env.INDEXNOW_URL?.trim();
const secret = process.env.CRON_SECRET?.trim();

async function main() {
  if (!url || !secret) {
    throw new Error(`missing ${[!url && "INDEXNOW_URL", !secret && "CRON_SECRET"].filter(Boolean).join(" and ")}`);
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}` },
    signal: AbortSignal.timeout(60_000),
  });
  const body = await response.text();
  console.log(`[indexnow-cron] ${response.status} ${body.slice(0, 300)}`);
  if (!response.ok) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`[indexnow-cron] ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
