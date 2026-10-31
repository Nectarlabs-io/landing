import {
  HONEYPOT_FIELD,
  MIN_FILL_TIME_MS,
  type PilotErrorCode,
  validatePilotRequest,
} from "@/lib/pilot";
import { readPilotConfig } from "@/lib/server/config";
import { getPool } from "@/lib/server/db";
import { errorCode, logEvent } from "@/lib/server/log";
import { sendNotificationEmail, sendWebhook } from "@/lib/server/notify";
import { insertPilotRequest } from "@/lib/server/pilot-store";
import { clientIp, hashIp, userAgent } from "@/lib/server/request-meta";

function fail(status: number, error: PilotErrorCode, message?: string) {
  return Response.json({ ok: false, error, message }, { status });
}

/**
 * Receives "Talk to us" submissions.
 *
 * Order: honeypot → fill time → validation → rate limit + insert → notify.
 * The database row is the record: once it is stored the response is a
 * success, even if the email or webhook then fails.
 */
export async function POST(request: Request) {
  const configResult = readPilotConfig();
  if (!configResult.ok) {
    logEvent("pilot_request", {
      level: "error",
      outcome: "misconfigured",
      missing: configResult.missing.join(","),
    });
    return fail(503, "unavailable");
  }
  const config = configResult.config;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_json");
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return fail(400, "invalid_json");
  }
  const fields = body as Record<string, unknown>;

  // Bots: answer like a success so they move on, but store nothing.
  const trap = fields[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    logEvent("pilot_request", { outcome: "honeypot" });
    return Response.json({ ok: true });
  }

  const elapsedMs = fields.elapsedMs;
  if (typeof elapsedMs !== "number" || !Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_TIME_MS) {
    logEvent("pilot_request", { outcome: "too_fast" });
    return fail(400, "too_fast");
  }

  const validation = validatePilotRequest(fields);
  if (!validation.ok) {
    logEvent("pilot_request", { outcome: "invalid" });
    return fail(422, "invalid", validation.error);
  }

  let result;
  try {
    result = await insertPilotRequest(getPool(config.databaseUrl), validation.data, {
      ipHash: hashIp(clientIp(request.headers), config.ipHashSalt),
      userAgent: userAgent(request.headers),
    });
  } catch (error) {
    logEvent("pilot_request", { level: "error", outcome: "db_error", code: errorCode(error) });
    return fail(503, "unavailable");
  }

  if (result.status === "rate_limited") {
    logEvent("pilot_request", { outcome: "rate_limited" });
    return fail(429, "rate_limited");
  }

  const { row } = result;
  const [email, webhook] = await Promise.all([
    sendNotificationEmail(row, config.email),
    sendWebhook(row, config.webhookUrl),
  ]);

  const failed = email.status === "failed" || webhook.status === "failed";
  logEvent("pilot_request", {
    level: failed ? "error" : undefined,
    outcome: "stored",
    id: row.id,
    email: email.status === "failed" ? `failed:${email.reason}` : email.status,
    webhook: webhook.status === "failed" ? `failed:${webhook.reason}` : webhook.status,
  });

  return Response.json({ ok: true }, { status: 201 });
}
