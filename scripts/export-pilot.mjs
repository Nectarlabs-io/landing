#!/usr/bin/env node
/*
 * Export pilot_requests as CSV.
 *
 *   npm run export:pilot                     # writes CSV to stdout
 *   npm run export:pilot -- pilot.csv        # writes to a file
 *
 * Uses DATABASE_URL. Cells that a spreadsheet would read as a formula are
 * prefixed with an apostrophe, because submitters control their contents.
 */
import { writeFile } from "node:fs/promises";

import pg from "pg";

const COLUMNS = [
  "id",
  "created_at",
  "status",
  "role",
  "name",
  "email",
  "organisation",
  "chains",
  "handle",
  "markets",
  "capacity",
  "message",
  "user_agent",
  "ip_hash",
];

function toCell(value) {
  if (value == null) return "";
  let text = value instanceof Date ? value.toISOString() : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set.");

  const client = new pg.Client({ connectionString, connectionTimeoutMillis: 10_000 });
  await client.connect();
  try {
    const { rows } = await client.query(
      `SELECT ${COLUMNS.join(", ")} FROM pilot_requests ORDER BY created_at, id`,
    );
    const lines = [COLUMNS.join(","), ...rows.map((row) => COLUMNS.map((c) => toCell(row[c])).join(","))];
    const csv = `${lines.join("\r\n")}\r\n`;

    const outFile = process.argv[2];
    if (outFile) {
      await writeFile(outFile, csv, "utf8");
      console.error(`[export] wrote ${rows.length} row(s) to ${outFile}`);
    } else {
      process.stdout.write(csv);
    }
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(`[export] ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});
