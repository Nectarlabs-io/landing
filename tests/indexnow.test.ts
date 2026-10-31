import pg from "pg";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

// connection() needs a Next.js request scope; the route logic under test doesn't.
vi.mock("next/server", () => ({ connection: async () => {} }));

import { GET } from "@/app/api/indexnow/route";
import { closePools, getPool } from "@/lib/server/db";
import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_KEY,
  INDEXNOW_LOCK_KEY,
  submitChangedUrls,
} from "@/lib/server/indexnow";

import { resetDatabase, testDatabaseUrl } from "./helpers";

const DB_URL = testDatabaseUrl();
const SECRET = "cron-secret-for-tests-only";

let db: pg.Client;
let fetchMock: ReturnType<typeof vi.fn>;

const entries = [
  { url: "https://nectarnetwork.fun", lastModified: "2026-10-31" },
  { url: "https://nectarnetwork.fun/contact", lastModified: "2026-10-31" },
];

function submittedUrls(call = 0): string[] {
  const [, init] = fetchMock.mock.calls[call] as [string, RequestInit];
  return JSON.parse(String(init.body)).urlList;
}

async function recorded() {
  return (await db.query("SELECT url, last_modified::date::text AS day FROM indexnow_submissions ORDER BY url")).rows;
}

beforeAll(async () => {
  await resetDatabase(DB_URL);
  db = new pg.Client({ connectionString: DB_URL });
  await db.connect();
});

afterAll(async () => {
  await db.end();
  await closePools();
});

beforeEach(async () => {
  await db.query("TRUNCATE indexnow_submissions");
  fetchMock = vi.fn(async () => new Response(null, { status: 200 }));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("submitChangedUrls", () => {
  const submit = (list = entries) =>
    submitChangedUrls({ pool: getPool(DB_URL), entries: list, fetchImpl: fetchMock as typeof fetch });

  it("submits new URLs with the key and key location, then records them", async () => {
    expect(await submit()).toEqual({ outcome: "submitted", count: 2 });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(INDEXNOW_ENDPOINT);
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual({
      host: "nectarnetwork.fun",
      key: INDEXNOW_KEY,
      keyLocation: `https://nectarnetwork.fun/${INDEXNOW_KEY}.txt`,
      urlList: entries.map((e) => e.url),
    });
    expect(await recorded()).toEqual([
      { url: "https://nectarnetwork.fun", day: "2026-10-31" },
      { url: "https://nectarnetwork.fun/contact", day: "2026-10-31" },
    ]);
  });

  it("does nothing when no lastModified changed", async () => {
    await submit();
    expect(await submit()).toEqual({ outcome: "unchanged", count: 0 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("submits only the URLs whose lastModified moved forward", async () => {
    await submit();
    const updated = [entries[0], { ...entries[1], lastModified: "2026-11-02" }];
    expect(await submit(updated)).toEqual({ outcome: "submitted", count: 1 });
    expect(submittedUrls(1)).toEqual(["https://nectarnetwork.fun/contact"]);
    expect((await recorded())[1].day).toBe("2026-11-02");
  });

  it("ignores URLs on other hosts", async () => {
    await submit([...entries, { url: "https://example.com/x", lastModified: "2026-10-31" }]);
    expect(submittedUrls()).toEqual(entries.map((e) => e.url));
  });

  it("records nothing when IndexNow refuses, so the next run retries", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 403 }));
    expect(await submit()).toEqual({ outcome: "indexnow_http_403", count: 0 });
    expect(await recorded()).toEqual([]);
    expect(await submit()).toEqual({ outcome: "submitted", count: 2 });
  });

  it("rethrows network errors without recording or leaking a connection", async () => {
    fetchMock.mockRejectedValueOnce(new Error("socket hang up"));
    await expect(submit()).rejects.toThrow("socket hang up");
    expect(await recorded()).toEqual([]);
    expect(getPool(DB_URL).totalCount - getPool(DB_URL).idleCount).toBe(0);
  });

  it("skips while another run holds the lock", async () => {
    await db.query("BEGIN");
    await db.query("SELECT pg_advisory_xact_lock($1)", [INDEXNOW_LOCK_KEY]);
    try {
      expect(await submit()).toEqual({ outcome: "locked", count: 0 });
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      await db.query("ROLLBACK");
    }
  });
});

describe("GET /api/indexnow (the cron job)", () => {
  const call = (authorization?: string) =>
    GET(
      new Request("http://localhost/api/indexnow", {
        headers: authorization ? { authorization } : {},
      }),
    );

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("CRON_SECRET", SECRET);
    vi.stubEnv("DATABASE_URL", DB_URL);
    vi.stubEnv("INDEXNOW_ENABLED", "true");
    vi.stubEnv("SITE_NOINDEX", "");
  });

  it("rejects requests without the cron secret", async () => {
    expect((await call()).status).toBe(401);
    expect((await call("Bearer wrong")).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects every request when CRON_SECRET is unset", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await call(`Bearer `)).status).toBe(401);
  });

  it("does nothing until INDEXNOW_ENABLED=true", async () => {
    vi.stubEnv("INDEXNOW_ENABLED", "");
    const response = await call(`Bearer ${SECRET}`);
    expect(await response.json()).toEqual({ ok: true, outcome: "disabled", count: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does nothing on a noindex build", async () => {
    vi.stubEnv("SITE_NOINDEX", "true");
    expect(await (await call(`Bearer ${SECRET}`)).json()).toMatchObject({ outcome: "disabled" });
  });

  it("submits the published pages from the sitemap", async () => {
    const response = await call(`Bearer ${SECRET}`);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ ok: true, outcome: "submitted" });
    expect(submittedUrls()).toEqual(expect.arrayContaining(["https://nectarnetwork.fun", "https://nectarnetwork.fun/contact"]));
    // Drafts never reach IndexNow.
    expect(submittedUrls().some((url) => url.includes("/learn"))).toBe(false);
  });
});
