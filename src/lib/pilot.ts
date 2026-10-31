/*
 * Pilot-cohort form: options, limits and validation shared by the form
 * (client) and POST /api/pilot (server). Keep this module free of Node APIs.
 */

// The roles the form offers, in the design's order (Oct 31). The database also
// allows legacy ids (see LEGACY_ROLE_LABELS) so rows stored earlier stay valid.
export const PILOT_ROLES = [
  { id: "app", label: "App, broker or agent with borrowers" },
  { id: "lender", label: "Lender or curator" },
  { id: "buyer", label: "Buyer, market maker or prop AMM" },
  { id: "protocol", label: "Lending protocol" },
  { id: "issuer", label: "Asset issuer" },
  { id: "keeper", label: "Keeper operator" },
  { id: "other", label: "Something else" },
] as const;

export type PilotRole = (typeof PILOT_ROLES)[number]["id"];

/** Ids no longer offered, kept so earlier rows still read sensibly in email and export. */
export const LEGACY_ROLE_LABELS: Record<string, string> = {
  curator: "Curator or risk manager",
};

export const CAPACITY_OPTIONS = [
  { value: "", label: "Not sure yet" },
  { value: "lt1", label: "Under $1M" },
  { value: "1-10", label: "$1M to $10M" },
  { value: "10-50", label: "$10M to $50M" },
  { value: "gt50", label: "Over $50M" },
] as const;

export type CapacityRange = (typeof CAPACITY_OPTIONS)[number]["value"];

/** Maximum characters per field. */
export const MAX_FIELD_LENGTH = 200;
export const MAX_MESSAGE_LENGTH = 4000;

/** Submissions sent sooner than this after the form loaded are treated as bots. */
export const MIN_FILL_TIME_MS = 3000;

/** Hidden form field: people leave it empty, form-filling bots don't. */
export const HONEYPOT_FIELD = "website";

/** `error` values returned by POST /api/pilot. */
export type PilotErrorCode =
  | "invalid_json"
  | "too_fast"
  | "invalid"
  | "rate_limited"
  | "unavailable";

export type PilotRequest = {
  role: PilotRole | null;
  chains: string;
  name: string;
  email: string;
  organisation: string;
  handle: string;
  markets: string;
  capacity: CapacityRange;
  message: string;
};

export type PilotTextField = Exclude<keyof PilotRequest, "role" | "capacity">;

export const EMPTY_PILOT_REQUEST: PilotRequest = {
  role: null,
  chains: "",
  name: "",
  email: "",
  organisation: "",
  handle: "",
  markets: "",
  capacity: "",
  message: "",
};

const FIELD_LABELS: Record<PilotTextField, string> = {
  chains: "Chains",
  name: "Name",
  email: "Work email",
  organisation: "Organisation",
  handle: "Telegram or X",
  markets: "Markets or collateral",
  message: "Anything else",
};

export function maxLengthFor(field: PilotTextField): number {
  return field === "message" ? MAX_MESSAGE_LENGTH : MAX_FIELD_LENGTH;
}

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
  if (!request.organisation.trim()) missing.push("your organisation");
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

export function roleLabel(role: string | null): string {
  if (role == null) return "—";
  return PILOT_ROLES.find((option) => option.id === role)?.label ?? LEGACY_ROLE_LABELS[role] ?? role;
}

export type ValidationResult =
  | { ok: true; data: PilotRequest }
  | { ok: false; error: string };

/**
 * Validate an untrusted body. Strings are trimmed; anything over its length
 * cap, an unknown role or an unknown capacity range is rejected, not fixed up.
 */
export function validatePilotRequest(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "Expected a JSON object." };
  }
  const input = body as Record<string, unknown>;

  const text: Partial<Record<PilotTextField, string>> = {};
  for (const field of Object.keys(FIELD_LABELS) as PilotTextField[]) {
    const raw = input[field];
    if (raw != null && typeof raw !== "string") {
      return { ok: false, error: `${FIELD_LABELS[field]} must be text.` };
    }
    const value = (raw ?? "").trim();
    if (value.length > maxLengthFor(field)) {
      return {
        ok: false,
        error: `Keep "${FIELD_LABELS[field]}" under ${maxLengthFor(field).toLocaleString("en-US")} characters.`,
      };
    }
    text[field] = value;
  }

  const roleInput = input.role;
  const role = PILOT_ROLES.find((option) => option.id === roleInput)?.id ?? null;
  if (roleInput != null && roleInput !== "" && role === null) {
    return { ok: false, error: "Pick one of the listed roles." };
  }

  const capacityInput = input.capacity ?? "";
  const capacity = CAPACITY_OPTIONS.find((option) => option.value === capacityInput)?.value;
  if (capacity === undefined) {
    return { ok: false, error: "Pick one of the listed sizes." };
  }

  const data: PilotRequest = {
    role,
    chains: text.chains ?? "",
    name: text.name ?? "",
    email: text.email ?? "",
    organisation: text.organisation ?? "",
    handle: text.handle ?? "",
    markets: text.markets ?? "",
    capacity,
    message: text.message ?? "",
  };

  const missing = missingPilotFields(data);
  if (missing.length > 0) {
    return { ok: false, error: describeMissing(missing) };
  }
  return { ok: true, data };
}
