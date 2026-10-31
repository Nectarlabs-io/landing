import { createHash } from "node:crypto";

/**
 * The client's IP. Vercel sets X-Real-IP (identical to X-Forwarded-For) and
 * overwrites both, so a client can't spoof them; Railway's edge also sets
 * X-Real-IP. X-Forwarded-For is a fallback for other proxies and local runs.
 */
export function clientIp(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "unknown";
}

/** sha256(ip + salt) as hex. The raw IP is never stored or logged. */
export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(ip + salt).digest("hex");
}

const MAX_USER_AGENT = 500;

export function userAgent(headers: Headers): string | null {
  return headers.get("user-agent")?.slice(0, MAX_USER_AGENT) || null;
}
