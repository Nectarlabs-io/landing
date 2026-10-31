import type { Pool } from "pg";

import { site } from "@/lib/site";

/*
 * IndexNow (used by Bing, and so by Copilot). The key is public by design: it
 * is served at /<key>.txt to prove the host owns the submissions.
 */
export const INDEXNOW_KEY = "cb936410115550f57a308d52475044dd";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
// An arbitrary constant: only one run submits at a time.
export const INDEXNOW_LOCK_KEY = 7_031_442_902;

export type SitemapEntry = { url: string; lastModified: string };

/** Entries never submitted, or whose lastModified is newer than the last submission. */
export async function changedEntries(
  db: Pick<Pool, "query">,
  entries: SitemapEntry[],
): Promise<SitemapEntry[]> {
  if (entries.length === 0) return [];
  const { rows } = await db.query<{ url: string; changed: boolean }>(
    `SELECT e.url, (s.url IS NULL OR s.last_modified < e.last_modified::timestamptz) AS changed
       FROM unnest($1::text[], $2::text[]) AS e(url, last_modified)
       LEFT JOIN indexnow_submissions s ON s.url = e.url`,
    [entries.map((e) => e.url), entries.map((e) => e.lastModified)],
  );
  const changed = new Set(rows.filter((r) => r.changed).map((r) => r.url));
  return entries.filter((e) => changed.has(e.url));
}

/**
 * Submit the sitemap entries that changed since the last accepted
 * submission, and record them only after IndexNow accepts (200 or 202).
 *
 * Runs in one transaction holding a transaction-scoped advisory lock, so it
 * is safe behind a transaction-mode connection pooler (e.g. Neon's) and two
 * overlapping runs never submit the same URLs.
 */
export async function submitChangedUrls(options: {
  pool: Pool;
  entries: SitemapEntry[];
  fetchImpl?: typeof fetch;
}): Promise<{ outcome: string; count: number }> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const host = new URL(site.url).host;
  const entries = options.entries.filter((e) => new URL(e.url).host === host);

  const client = await options.pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ locked: boolean }>(
      "SELECT pg_try_advisory_xact_lock($1) AS locked",
      [INDEXNOW_LOCK_KEY],
    );
    if (!rows[0].locked) {
      await client.query("ROLLBACK");
      return { outcome: "locked", count: 0 };
    }

    const changed = await changedEntries(client, entries);
    if (changed.length === 0) {
      await client.query("COMMIT");
      return { outcome: "unchanged", count: 0 };
    }

    const response = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${site.url}/${INDEXNOW_KEY}.txt`,
        urlList: changed.map((e) => e.url),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (response.status !== 200 && response.status !== 202) {
      await client.query("ROLLBACK");
      return { outcome: `indexnow_http_${response.status}`, count: 0 };
    }

    await client.query(
      `INSERT INTO indexnow_submissions (url, last_modified)
       SELECT * FROM unnest($1::text[], $2::timestamptz[])
       ON CONFLICT (url) DO UPDATE SET last_modified = EXCLUDED.last_modified, submitted_at = now()`,
      [changed.map((e) => e.url), changed.map((e) => e.lastModified)],
    );
    await client.query("COMMIT");
    return { outcome: "submitted", count: changed.length };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
