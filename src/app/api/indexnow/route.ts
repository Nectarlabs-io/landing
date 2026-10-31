import { timingSafeEqual } from "node:crypto";

import { connection } from "next/server";

import sitemap from "@/app/sitemap";
import { siteIsIndexable } from "@/lib/seo/indexing";
import { getPool } from "@/lib/server/db";
import { submitChangedUrls } from "@/lib/server/indexnow";
import { errorCode, logEvent } from "@/lib/server/log";

/*
 * Pings IndexNow with sitemap URLs whose lastModified changed since the last
 * accepted submission. Called once a day by the Railway cron service
 * (scripts/indexnow-cron.mjs), which sends "Authorization: Bearer
 * $CRON_SECRET".
 *
 * Off unless INDEXNOW_ENABLED=true, so nothing is submitted before
 * nectarnetwork.fun serves this site (IndexNow checks the key file there).
 */

function authorized(header: string | null, secret: string): boolean {
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header ?? "");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

const json = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request: Request) {
  await connection();

  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || !authorized(request.headers.get("authorization"), secret)) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  if (process.env.INDEXNOW_ENABLED !== "true" || !siteIsIndexable()) {
    return json({ ok: true, outcome: "disabled", count: 0 });
  }
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    logEvent("indexnow", { level: "error", outcome: "misconfigured", missing: "DATABASE_URL" });
    return json({ ok: false, error: "unavailable" }, 503);
  }

  try {
    const entries = sitemap().map((entry) => ({
      url: entry.url,
      lastModified: String(entry.lastModified),
    }));
    const result = await submitChangedUrls({ pool: getPool(databaseUrl), entries });
    logEvent("indexnow", { outcome: result.outcome, count: result.count });
    return json({ ok: true, ...result });
  } catch (error) {
    logEvent("indexnow", { level: "error", outcome: "error", code: errorCode(error) });
    return json({ ok: false, error: "failed" }, 500);
  }
}
