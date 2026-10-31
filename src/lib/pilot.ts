/*
 * Pilot-cohort contact form: options, validation and parsing shared by the
 * form (client) and the /api/pilot route handler (server).
 */

export const PILOT_ROLES = [
  { id: "curator", label: "Curator or risk manager" },
  { id: "protocol", label: "Lending protocol" },
  { id: "buyer", label: "Buyer or market maker" },
  { id: "issuer", label: "Collateral issuer" },
  { id: "app", label: "Automation or looping app" },
  { id: "keeper", label: "Keeper operator" },
  { id: "other", label: "Something else" },
] as const;

export type PilotRole = (typeof PILOT_ROLES)[number]["id"];

export const CAPACITY_OPTIONS = [
  { value: "", label: "Not sure yet" },
  { value: "lt1", label: "Under $1M" },
  { value: "1-10", label: "$1M to $10M" },
  { value: "10-50", label: "$10M to $50M" },
  { value: "gt50", label: "Over $50M" },
] as const;

export type CapacityRange = (typeof CAPACITY_OPTIONS)[number]["value"];

export type PilotRequest = {
  role: PilotRole | null;
  chains: string;
  name: string;
  email: string;
  org: string;
  handle: string;
  markets: string;
  capacity: CapacityRange;
  message: string;
};

export const EMPTY_PILOT_REQUEST: PilotRequest = {
  role: null,
  chains: "",
  name: "",
  email: "",
  org: "",
  handle: "",
  markets: "",
  capacity: "",
  message: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Required fields still missing, phrased for the error message. */
export function missingPilotFields(request: PilotRequest): string[] {
  const missing: string[] = [];
  if (!request.role) missing.push("what you do");
  if (!request.name.trim()) missing.push("your name");
  if (!isValidEmail(request.email)) missing.push("a work email");
  if (!request.org.trim()) missing.push("your organisation");
  return missing;
}

/** ["a", "b", "c"] → "Add a, b and c so we can reply." */
export function describeMissing(missing: string[]): string {
  const list =
    missing.length > 1
      ? `${missing.slice(0, -1).join(", ")} and ${missing[missing.length - 1]}`
      : missing[0];
  return `Add ${list} so we can reply.`;
}

export function roleLabel(role: PilotRole | null): string {
  return PILOT_ROLES.find((option) => option.id === role)?.label ?? "—";
}

const MAX_SHORT = 200;
const MAX_LONG = 4000;

/** Coerce, trim and bound an untrusted request body. */
export function parsePilotRequest(
  body: unknown,
): { ok: true; data: PilotRequest } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Expected a JSON object." };
  }

  const input = body as Record<string, unknown>;
  const text = (key: keyof PilotRequest, max = MAX_SHORT) => {
    const value = input[key];
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  };

  const data: PilotRequest = {
    role: PILOT_ROLES.find((option) => option.id === input.role)?.id ?? null,
    chains: text("chains"),
    name: text("name"),
    email: text("email"),
    org: text("org"),
    handle: text("handle"),
    markets: text("markets"),
    capacity: CAPACITY_OPTIONS.find((option) => option.value === input.capacity)?.value ?? "",
    message: text("message", MAX_LONG),
  };

  const missing = missingPilotFields(data);
  if (missing.length > 0) {
    return { ok: false, error: describeMissing(missing) };
  }
  return { ok: true, data };
}
