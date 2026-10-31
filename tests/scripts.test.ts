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
