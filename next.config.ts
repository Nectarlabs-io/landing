import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [{ source: "/app", destination: "/app/feed", permanent: false }];
  },
};

export default nextConfig;
