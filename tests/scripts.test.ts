import { execFile, execFileSync } from "node:child_process";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { promisify } from "node:util";

import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { resetDatabase, runScript, testDatabaseUrl } from "./helpers";

const DB_URL = testDatabaseUrl();
let db: pg.Client;

beforeAll(async () => {
  await resetDatabase(DB_URL);
  db = new pg.Client({ connectionString: DB_URL });
  await db.connect();
});

afterAll(async () => {
  await db.end();
});

describe("scripts/migrate.mjs", () => {
  it("is idempotent", () => {
    expect(runScript("scripts/migrate.mjs", DB_URL)).toContain("up to date");
  });

  it("exits non-zero when no database URL is set", () => {
    const env = { ...process.env, DATABASE_URL: "", MIGRATION_DATABASE_URL: "" };
    expect(() =>
      execFileSync(process.execPath, ["scripts/migrate.mjs"], { env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }),
    ).toThrow();
  });

  it("exits non-zero when the database is unreachable (so the deploy stops)", () => {
    expect(() => runScript("scripts/migrate.mjs", "postgres://x:y@127.0.0.1:1/none")).toThrow();
  });

  it("creates the columns and defaults the spec asks for", async () => {
    const { rows } = await db.query(
      `SELECT column_name, is_nullable, column_default FROM information_schema.columns
        WHERE table_name = 'pilot_requests' ORDER BY ordinal_position`,
    );
    expect(rows.map((r) => r.column_name)).toEqual([
      "id",
      "created_at",
      "role",
      "chains",
      "name",
      "email",
      "organisation",
      "handle",
      "markets",
      "capacity",
      "message",
      "user_agent",
      "ip_hash",
      "status",
    ]);
    const byName = Object.fromEntries(rows.map((r) => [r.column_name, r]));
    for (const required of ["role", "name", "email", "organisation"]) {
      expect(byName[required].is_nullable).toBe("NO");
    }
    expect(byName.created_at.column_default).toBe("now()");
    expect(byName.status.column_default).toBe("'new'::text");
  });

  it("enforces limits in the database too", async () => {
    await expect(
      db.query(
        `INSERT INTO pilot_requests (role, name, email, organisation) VALUES ('admin', 'a', 'a@b.c', 'o')`,
      ),
    ).rejects.toThrow(/check constraint/);
    await expect(
      db.query(
        `INSERT INTO pilot_requests (role, name, email, organisation) VALUES ('buyer', repeat('a', 201), 'a@b.c', 'o')`,
      ),
    ).rejects.toThrow(/check constraint/);
  });

  it("allows the new lender role and keeps legacy curator rows valid (migration 003)", async () => {
    await db.query(`INSERT INTO pilot_requests (role, name, email, organisation) VALUES ('lender', 'a', 'a@b.c', 'o')`);
    await db.query(`INSERT INTO pilot_requests (role, name, email, organisation) VALUES ('curator', 'a', 'a@b.c', 'o')`);
    await db.query(`DELETE FROM pilot_requests WHERE name = 'a'`);
  });
});

describe("npm run export:pilot", () => {
  it("writes CSV with quoting and formula injection neutralised", async () => {
    await db.query("TRUNCATE pilot_requests RESTART IDENTITY");
    await db.query(
      `INSERT INTO pilot_requests (role, name, email, organisation, message)
       VALUES ('buyer', '=HYPERLINK("http://x")', 'ada@example.com', 'Engines, Ltd', 'line one
line two')`,
    );
    const csv = runScript("scripts/export-pilot.mjs", DB_URL);
    const [header, ...rest] = csv.trimEnd().split("\r\n");
    expect(header).toBe(
      "id,created_at,status,role,name,email,organisation,chains,handle,markets,capacity,message,user_agent,ip_hash",
    );
    const record = rest.join("\r\n");
    expect(record).toContain(`"'=HYPERLINK(""http://x"")"`);
    expect(record).toContain('"Engines, Ltd"');
    expect(record).toContain('"line one\nline two"');
  });
});

describe("scripts/indexnow-cron.mjs", () => {
  const run = promisify(execFile);

  it("calls the web service with the bearer secret and exits 0 on success", async () => {
    let auth: string | undefined;
    const server = createServer((req, res) => {
      auth = req.headers.authorization;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ ok: true, outcome: "disabled", count: 0 }));
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    try {
      const { stdout } = await run(process.execPath, ["scripts/indexnow-cron.mjs"], {
        env: { ...process.env, INDEXNOW_URL: `http://127.0.0.1:${port}/api/indexnow`, CRON_SECRET: "s3cret" },
      });
      expect(auth).toBe("Bearer s3cret");
      expect(stdout).toContain('"outcome":"disabled"');
      expect(stdout).not.toContain("s3cret");
    } finally {
      server.close();
    }
  });

  it("exits non-zero when the web service refuses or isn't configured", async () => {
    const server = createServer((_req, res) => {
      res.statusCode = 401;
      res.end("{}");
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    try {
      await expect(
        run(process.execPath, ["scripts/indexnow-cron.mjs"], {
          env: { ...process.env, INDEXNOW_URL: `http://127.0.0.1:${port}/x`, CRON_SECRET: "wrong" },
        }),
      ).rejects.toThrow();
      await expect(
        run(process.execPath, ["scripts/indexnow-cron.mjs"], { env: { ...process.env, INDEXNOW_URL: "", CRON_SECRET: "" } }),
      ).rejects.toThrow();
    } finally {
      server.close();
    }
  });
});
