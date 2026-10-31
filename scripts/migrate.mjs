#!/usr/bin/env node
/*
 * Applies the plain SQL files in /migrations, in filename order, once each.
 *
 * On Vercel it runs inside the production build (scripts/vercel-build.mjs);
 * when self-hosting, as a pre-deploy command. Any failure exits non-zero,
 * which fails the deploy and leaves the previous version serving traffic.
 *
 * Each file runs in its own transaction and is recorded in schema_migrations.
 * A session advisory lock stops two deploys migrating at the same time, so it
 * connects directly rather than through a transaction-mode pooler: it uses
 * MIGRATION_DATABASE_URL, then DATABASE_URL_UNPOOLED (set by the Neon
 * integration), then DATABASE_URL.
 *
 *   --skip-if-unset   exit 0 with a notice when no database URL is set
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const MIGRATIONS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "migrations");
// Arbitrary constant identifying this app's migration lock.
const LOCK_KEY = 7_031_442_901;

async function main() {
  const connectionString =
    process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!connectionString) {
    if (process.argv.includes("--skip-if-unset")) {
      console.log("[migrate] skipped: no database URL is set");
      return;
    }
    throw new Error("DATABASE_URL is not set.");
  }

  const files = (await readdir(MIGRATIONS_DIR)).filter((file) => file.endsWith(".sql")).sort();
  const client = new pg.Client({ connectionString, connectionTimeoutMillis: 10_000 });
  await client.connect();

  try {
    await client.query("SELECT pg_advisory_lock($1)", [LOCK_KEY]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name       text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    const { rows } = await client.query("SELECT name FROM schema_migrations");
    const applied = new Set(rows.map((row) => row.name));
    const pending = files.filter((file) => !applied.has(file));

    if (pending.length === 0) {
      console.log(`[migrate] up to date (${files.length} migrations)`);
      return;
    }

    for (const file of pending) {
      const sql = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`[migrate] applying ${file}`);
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [file]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`${file} failed: ${error instanceof Error ? error.message : error}`);
      }
    }
    console.log(`[migrate] applied ${pending.length} migration(s)`);
  } finally {
    await client.query("SELECT pg_advisory_unlock($1)", [LOCK_KEY]).catch(() => {});
    await client.end();
  }
}

main().catch((error) => {
  console.error(`[migrate] ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
