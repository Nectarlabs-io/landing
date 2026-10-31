import { parsePilotRequest, roleLabel } from "@/lib/pilot";

/**
 * Receives "Talk to us" submissions and forwards them as JSON to
 * PILOT_WEBHOOK_URL (a Slack/Zapier/CRM webhook, for example).
 *
 * Without PILOT_WEBHOOK_URL, development accepts and discards the request so
 * the form can be exercised locally; production returns 503 so leads are
 * never silently dropped.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Honeypot: the hidden "website" field is only ever filled in by bots.
  if (typeof body === "object" && body !== null && (body as { website?: unknown }).website) {
    return Response.json({ ok: true });
  }

  const parsed = parsePilotRequest(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 422 });
  }

  const webhookUrl = process.env.PILOT_WEBHOOK_URL;
  if (!webhookUrl) {
    if (process.env.NODE_ENV === "production") {
      console.error("[pilot] PILOT_WEBHOOK_URL is not set; cannot deliver pilot request.");
      return Response.json({ error: "Not configured." }, { status: 503 });
    }
    console.info("[pilot] PILOT_WEBHOOK_URL is not set; request accepted but not forwarded.");
    return Response.json({ ok: true });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...parsed.data,
        roleLabel: roleLabel(parsed.data.role),
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }
  } catch (error) {
    console.error("[pilot] Forwarding failed:", error);
    return Response.json({ error: "Could not deliver request." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
