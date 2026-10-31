#!/usr/bin/env node
/*
 * Vercel's build command (see vercel.json).
 *
 * Production builds apply pending migrations first, so the schema is ready
 * before the new deployment takes traffic; a failed migration fails the
 * build and the previous deployment keeps serving. Preview builds never
 * migrate, so a preview can't change the production database.
 *
 * Then `next build`.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (process.env.VERCEL_ENV === "production") {
  run([path.join(root, "scripts", "migrate.mjs"), "--skip-if-unset"]);
} else {
  console.log(`[vercel-build] ${process.env.VERCEL_ENV ?? "local"} build: migrations skipped`);
}

run([path.join(root, "node_modules", "next", "dist", "bin", "next"), "build"]);
