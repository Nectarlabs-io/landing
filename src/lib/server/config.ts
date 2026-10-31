import { site } from "@/lib/site";

export type PilotConfig = {
  databaseUrl: string;
  ipHashSalt: string;
  /** Email is optional: without a key and sender, requests are stored but not emailed. */
  email: { apiKey: string; from: string; to: string } | null;
  webhookUrl: string | null;
};

/** Read and check the pilot form's environment. Values are never logged. */
export function readPilotConfig(
  env: NodeJS.ProcessEnv = process.env,
): { ok: true; config: PilotConfig } | { ok: false; missing: string[] } {
  const value = (key: string) => env[key]?.trim() || null;

  const missing = ["DATABASE_URL", "IP_HASH_SALT"].filter((key) => !value(key));
  if (missing.length > 0) return { ok: false, missing };

  const apiKey = value("RESEND_API_KEY");
  const from = value("PILOT_FROM");

  return {
    ok: true,
    config: {
      databaseUrl: value("DATABASE_URL")!,
      ipHashSalt: value("IP_HASH_SALT")!,
      email:
        apiKey && from ? { apiKey, from, to: value("PILOT_NOTIFY_TO") ?? site.contactEmail } : null,
      webhookUrl: value("PILOT_WEBHOOK_URL"),
    },
  };
}
