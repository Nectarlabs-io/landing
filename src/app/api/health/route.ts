import { connection } from "next/server";

/**
 * Railway's deployment health check. connection() keeps this out of the
 * build-time prerender, so a 200 means the running server answered.
 */
export async function GET() {
  await connection();
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
