import { execFileSync } from "node:child_process";

import pg from "pg";

/** A Postgres database the tests may wipe, e.g. postgres://user:pass@127.0.0.1:5432/nectar_test */
export function testDatabaseUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      "Set TEST_DATABASE_URL to a disposable Postgres database to run these tests (see README).",
    );
  }
  return url;
}

/** Drop everything and rebuild the schema with the real migration script. */
export async function resetDatabase(url: string): Promise<void> {
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  await client.query("DROP TABLE IF EXISTS pilot_requests, indexnow_submissions, schema_migrations");
  await client.end();
  runScript("scripts/migrate.mjs", url);
}

export function runScript(script: string, databaseUrl: string, args: string[] = []): string {
  return execFileSync(process.execPath, [script, ...args], {
    // Only DATABASE_URL, so a developer's MIGRATION_DATABASE_URL can't leak in.
    env: { ...process.env, DATABASE_URL: databaseUrl, MIGRATION_DATABASE_URL: "", DATABASE_URL_UNPOOLED: "" },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}
