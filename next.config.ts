import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (see Dockerfile).
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        // Canonical host: www → apex, keeping the path. 301 rather than
        // Next's default 308, as requested for the domain move.
        source: "/:path*",
        has: [{ type: "host", value: "www.nectarnetwork.fun" }],
        destination: "https://nectarnetwork.fun/:path*",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
