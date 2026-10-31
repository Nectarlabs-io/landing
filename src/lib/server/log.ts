/*
 * Structured logs for the pilot form. Only ids, outcomes and error codes go
 * here: never submission content, emails, IPs or IP hashes.
 */

type Field = string | number | boolean | null | undefined;

export function logEvent(event: string, fields: Record<string, Field> = {}): void {
  const line = JSON.stringify({ event, ...fields });
  if (fields.level === "error") {
    console.error(line);
  } else {
    console.info(line);
  }
}

/** A loggable description of an error that cannot carry user data. */
export function errorCode(error: unknown): string {
  if (error && typeof error === "object") {
    const { code, name } = error as { code?: unknown; name?: unknown };
    if (typeof code === "string" && code) return code;
    if (typeof name === "string" && name) return name;
  }
  return "unknown";
}
