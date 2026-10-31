import { CAPACITY_OPTIONS, roleLabel } from "@/lib/pilot";

import type { PilotConfig } from "./config";
import type { StoredPilotRequest } from "./pilot-store";

export type NotifyOutcome =
  | { status: "sent" }
  | { status: "skipped" }
  | { status: "failed"; reason: string };

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const TIMEOUT_MS = 10_000;

const oneLine = (value: string, max: number) => value.replace(/\s+/g, " ").trim().slice(0, max);

function capacityLabel(value: string): string {
  return CAPACITY_OPTIONS.find((option) => option.value === value)?.label ?? "Not sure yet";
}

export function notificationEmail(row: StoredPilotRequest) {
  const role = roleLabel(row.role);
  const lines = [
    `New pilot request #${row.id}`,
    "",
    `Role: ${role}`,
    `Name: ${row.name}`,
    `Work email: ${row.email}`,
    `Organisation: ${row.organisation}`,
    `Chains: ${row.chains || "—"}`,
    `Telegram or X: ${row.handle || "—"}`,
    `Markets or collateral: ${row.markets || "—"}`,
    `Size involved: ${capacityLabel(row.capacity)}`,
    "",
    "Anything else:",
    row.message || "—",
    "",
    `Received ${row.createdAt.toISOString()}. Reply to this email to answer ${oneLine(row.name, 80)} directly.`,
  ];
  return {
    subject: `Pilot request: ${oneLine(row.organisation, 80)} (${role})`,
    text: lines.join("\n"),
  };
}

/**
 * Email the notification through Resend's HTTPS API (Railway blocks SMTP on
 * Free, Trial and Hobby). Reply-To is the submitter. The row id is the
 * idempotency key, so a retried request cannot send twice.
 */
export async function sendNotificationEmail(
  row: StoredPilotRequest,
  email: PilotConfig["email"],
): Promise<NotifyOutcome> {
  if (!email) return { status: "skipped" };

  const { subject, text } = notificationEmail(row);
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${email.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `pilot-request-${row.id}`,
      },
      body: JSON.stringify({
        from: email.from,
        to: [email.to],
        reply_to: row.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return response.ok ? { status: "sent" } : { status: "failed", reason: `http_${response.status}` };
  } catch (error) {
    const name = error instanceof Error ? error.name : "unknown";
    return { status: "failed", reason: name };
  }
}

/** Optional extra notification: POST the stored row as JSON to PILOT_WEBHOOK_URL. */
export async function sendWebhook(
  row: StoredPilotRequest,
  webhookUrl: string | null,
): Promise<NotifyOutcome> {
  if (!webhookUrl) return { status: "skipped" };
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...row,
        createdAt: row.createdAt.toISOString(),
        roleLabel: roleLabel(row.role),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return response.ok ? { status: "sent" } : { status: "failed", reason: `http_${response.status}` };
  } catch (error) {
    const name = error instanceof Error ? error.name : "unknown";
    return { status: "failed", reason: name };
  }
}
