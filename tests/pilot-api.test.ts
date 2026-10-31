import { createHash } from "node:crypto";

import pg from "pg";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/pilot/route";
import { MAX_FIELD_LENGTH, MAX_MESSAGE_LENGTH } from "@/lib/pilot";
import { closePools } from "@/lib/server/db";
import { RATE_LIMIT_PER_HOUR } from "@/lib/server/pilot-store";

import { resetDatabase, testDatabaseUrl } from "./helpers";

const DB_URL = testDatabaseUrl();
const SALT = "test-salt-not-for-production";
const IP = "203.0.113.7";

const VALID = {
  role: "buyer",
  name: "Ada Lovelace",
  email: "ada@example.com",
  organisation: "Analytical Engines",
  chains: "",
  handle: "@ada",
  markets: "cirBTC on Morpho",
  capacity: "10-50",
  message: "We would like to bid on PTs.",
  website: "",
  elapsedMs: 8_000,
};

// Strings that must never reach the logs.
const SECRETS = [VALID.name, VALID.email, VALID.organisation, VALID.message, IP];

let db: pg.Client;
let fetchMock: ReturnType<typeof vi.fn>;
let logs: string[];

function post(body: unknown, ip = IP) {
  return POST(
    new Request("http://localhost/api/pilot", {
      method: "POST",
      headers: { "content-type": "application/json", "x-real-ip": ip, "user-agent": "vitest" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

async function rows() {
  return (await db.query("SELECT * FROM pilot_requests ORDER BY id")).rows;
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
  await db.query("TRUNCATE pilot_requests RESTART IDENTITY");
  vi.stubEnv("DATABASE_URL", DB_URL);
  vi.stubEnv("IP_HASH_SALT", SALT);
  vi.stubEnv("RESEND_API_KEY", "re_test_key");
  vi.stubEnv("PILOT_FROM", "Nectar pilot <pilot@nectarnetwork.fun>");
  vi.stubEnv("PILOT_NOTIFY_TO", "kunal@nectarnetwork.fun");
  vi.stubEnv("PILOT_WEBHOOK_URL", "");

  fetchMock = vi.fn(async () => Response.json({ id: "email-id" }));
  vi.stubGlobal("fetch", fetchMock);

  logs = [];
  const capture = (...args: unknown[]) => void logs.push(args.map(String).join(" "));
  vi.spyOn(console, "info").mockImplementation(capture);
  vi.spyOn(console, "error").mockImplementation(capture);
});

afterEach(() => {
  // No log line may contain submission content or the raw IP.
  for (const line of logs) {
    for (const secret of SECRETS) expect(line).not.toContain(secret);
  }
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/pilot", () => {
  it("stores a valid submission and emails kunal@ with reply-to set to the submitter", async () => {
    const response = await post(VALID);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true });

    const [row] = await rows();
    expect(row).toMatchObject({
      role: "buyer",
      name: "Ada Lovelace",
      email: "ada@example.com",
      organisation: "Analytical Engines",
      chains: null,
      handle: "@ada",
      markets: "cirBTC on Morpho",
      capacity: "10-50",
      message: "We would like to bid on PTs.",
      user_agent: "vitest",
      status: "new",
    });
    expect(row.created_at).toBeInstanceOf(Date);
    expect(row.ip_hash).toBe(createHash("sha256").update(IP + SALT).digest("hex"));
    expect(JSON.stringify(row)).not.toContain(IP);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer re_test_key");
    expect(headers["Idempotency-Key"]).toBe(`pilot-request-${row.id}`);
    const email = JSON.parse(init.body as string);
    expect(email).toMatchObject({
      from: "Nectar pilot <pilot@nectarnetwork.fun>",
      to: ["kunal@nectarnetwork.fun"],
      reply_to: "ada@example.com",
      subject: "Pilot request: Analytical Engines (Buyer or market maker)",
    });
    expect(email.text).toContain("We would like to bid on PTs.");

    expect(logs.join("\n")).toContain('"outcome":"stored"');
    expect(logs.join("\n")).toContain(`"id":"${row.id}"`);
  });

  it("still succeeds when the email API fails, and logs the failure", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 500 }));
    const response = await post(VALID);
    expect(response.status).toBe(201);
    expect(await rows()).toHaveLength(1);
    expect(logs.join("\n")).toContain('"email":"failed:http_500"');
  });

  it("still succeeds when the email API is unreachable", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    expect((await post(VALID)).status).toBe(201);
    expect(await rows()).toHaveLength(1);
    expect(logs.join("\n")).toContain('"email":"failed:TypeError"');
  });

  it("stores but skips email when Resend is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await post(VALID)).status).toBe(201);
    expect(await rows()).toHaveLength(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(logs.join("\n")).toContain('"email":"skipped"');
  });

  it("sends the optional webhook only when PILOT_WEBHOOK_URL is set", async () => {
    vi.stubEnv("PILOT_WEBHOOK_URL", "https://hooks.example.test/pilot");
    fetchMock.mockImplementation(async (url: string) =>
      url.startsWith("https://hooks.") ? new Response("", { status: 502 }) : Response.json({}),
    );
    expect((await post(VALID)).status).toBe(201);
    const urls = fetchMock.mock.calls.map(([url]) => url);
    expect(urls).toEqual(
      expect.arrayContaining(["https://api.resend.com/emails", "https://hooks.example.test/pilot"]),
    );
    expect(logs.join("\n")).toContain('"webhook":"failed:http_502"');
  });

  it("drops honeypot submissions without storing or emailing", async () => {
    const response = await post({ ...VALID, website: "http://spam.example" });
    expect(response.status).toBe(200);
    expect(await rows()).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(logs.join("\n")).toContain('"outcome":"honeypot"');
  });

  it("rejects submissions sent less than 3 seconds after the page loaded", async () => {
    for (const elapsedMs of [0, 1_200, 2_999, undefined, "5000"]) {
      const response = await post({ ...VALID, elapsedMs });
      expect(response.status).toBe(400);
      expect((await response.json()).error).toBe("too_fast");
    }
    expect(await rows()).toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it(`rate-limits to ${RATE_LIMIT_PER_HOUR} per hour per ip_hash, even when requests race`, async () => {
    const responses = await Promise.all(
      Array.from({ length: RATE_LIMIT_PER_HOUR + 3 }, () => post(VALID)),
    );
    const statuses = responses.map((r) => r.status).sort();
    expect(statuses.filter((s) => s === 201)).toHaveLength(RATE_LIMIT_PER_HOUR);
    expect(statuses.filter((s) => s === 429)).toHaveLength(3);
    expect(await rows()).toHaveLength(RATE_LIMIT_PER_HOUR);

    // A different address is unaffected.
    expect((await post(VALID, "198.51.100.4")).status).toBe(201);

    // Rows older than an hour no longer count.
    await db.query("UPDATE pilot_requests SET created_at = now() - interval '61 minutes'");
    expect((await post(VALID)).status).toBe(201);
  });

  it("rejects oversized fields", async () => {
    const tooLong = "x".repeat(MAX_FIELD_LENGTH + 1);
    for (const field of ["name", "email", "organisation", "chains", "handle", "markets"]) {
      const response = await post({ ...VALID, [field]: tooLong });
      expect(response.status).toBe(422);
      expect((await response.json()).error).toBe("invalid");
    }
    const longMessage = await post({ ...VALID, message: "x".repeat(MAX_MESSAGE_LENGTH + 1) });
    expect(longMessage.status).toBe(422);
    expect(await rows()).toHaveLength(0);

    // Exactly at the limits is fine.
    const atLimit = await post({
      ...VALID,
      name: "n".repeat(MAX_FIELD_LENGTH),
      message: "m".repeat(MAX_MESSAGE_LENGTH),
    });
    expect(atLimit.status).toBe(201);
  });

  it("rejects unknown roles, unknown capacity ranges and missing required fields", async () => {
    const cases: Array<[Record<string, unknown>, string]> = [
      [{ ...VALID, role: "admin" }, "Pick one of the listed roles."],
      [{ ...VALID, capacity: "gt1000" }, "Pick one of the listed capacity ranges."],
      [{ ...VALID, role: "" }, "Add what you do so we can reply."],
      [
        { ...VALID, name: " ", email: "not-an-email", organisation: "" },
        "Add your name, a work email and your organisation so we can reply.",
      ],
      [{ ...VALID, name: 42 }, "Name must be text."],
    ];
    for (const [body, message] of cases) {
      const response = await post(body);
      expect(response.status).toBe(422);
      expect(await response.json()).toMatchObject({ error: "invalid", message });
    }
    expect(await rows()).toHaveLength(0);
  });

  it("rejects malformed JSON", async () => {
    expect((await post("{not json")).status).toBe(400);
    expect((await post([1, 2])).status).toBe(400);
  });

  it("returns 503 when the database is unavailable, without emailing", async () => {
    // Nothing listens on port 1.
    vi.stubEnv("DATABASE_URL", "postgres://nectar:nectar@127.0.0.1:1/nectar_test");
    const response = await post(VALID);
    expect(response.status).toBe(503);
    expect((await response.json()).error).toBe("unavailable");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(logs.join("\n")).toContain('"outcome":"db_error"');
    expect(logs.join("\n")).toContain('"code":"ECONNREFUSED"');
  });

  it("returns 503 when required configuration is missing", async () => {
    vi.stubEnv("IP_HASH_SALT", "");
    const response = await post(VALID);
    expect(response.status).toBe(503);
    expect(await rows()).toHaveLength(0);
    expect(logs.join("\n")).toContain('"missing":"IP_HASH_SALT"');
  });
});
