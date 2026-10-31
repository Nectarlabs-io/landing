#!/usr/bin/env node
/*
 * The standalone server (.next/standalone/server.js) serves /public and
 * /_next/static only if they are copied next to it; `next build` does not
 * copy them. Runs automatically after `npm run build`.
 */
import { cpSync, existsSync } from "node:fs";

if (!existsSync(".next/standalone")) {
  console.error("[postbuild] .next/standalone is missing; is output: 'standalone' set?");
  process.exit(1);
}

cpSync("public", ".next/standalone/public", { recursive: true });
cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
console.log("[postbuild] copied public/ and .next/static/ into .next/standalone");
