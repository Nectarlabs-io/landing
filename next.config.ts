import { readFileSync } from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

const CANONICAL_HOST = "nectarnetwork.fun";

/** Whether a content page is published, read from its front matter at build time. */
function isPublished(file: string): boolean {
  const source = readFileSync(path.join(process.cwd(), "content", file), "utf8");
  return /^status:\s*published\s*$/m.test(source.split(/\n---\n/, 1)[0]);
}

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (Railway). Vercel builds its
  // own output, so it doesn't use standalone.
  output: process.env.VERCEL ? undefined : "standalone",
  // Routes that run on the server at request time (e.g. an OG image for an
  // unknown page) read Markdown from /content and fonts from src/assets/fonts.
  outputFileTracingIncludes: {
    "/*": ["./content/**/*", "./src/assets/fonts/*"],
  },
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Any host but the canonical one (*.up.railway.app service domains,
        // staging, any leftover *.vercel.app URL) is kept out of search results.
        // Host-based, so the same build serves the real domain without a flag
        // to flip.
        source: "/:path*",
        missing: [{ type: "host", value: CANONICAL_HOST.replace(/\./g, "\\.") }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  async redirects() {
    // URLs the previous site served (see docs/cutover.md). Its product pages
    // aren't part of this site, so they land on the home page.
    const legacy = [
      {
        source: "/features",
        destination: isPublished("pages/how-it-works.md") ? "/how-it-works" : "/#how",
      },
      { source: "/vault/:path*", destination: "/" },
      { source: "/performance/:path*", destination: "/" },
      { source: "/dashboard/:path*", destination: "/" },
    ];
    return [
      {
        // Canonical host: www → apex, keeping the path. 301 rather than
        // Next's default 308, as requested for the domain move. (HTTP → HTTPS
        // is a 301 at Railway's edge before requests reach the app.)
        source: "/:path*",
        has: [{ type: "host", value: `www\\.${CANONICAL_HOST.replace(/\./g, "\\.")}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        statusCode: 301,
      },
      ...legacy.map((rule) => ({ ...rule, statusCode: 301 as const })),
    ];
  },
};

export default nextConfig;
