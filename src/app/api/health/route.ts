import { connection } from "next/server";

/**
 * Health check for uptime monitors (and Railway's deploy check when
 * self-hosting). connection() keeps this out of the build-time prerender, so
 * a 200 means the running server answered.
 */
export async function GET() {
  await connection();
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
