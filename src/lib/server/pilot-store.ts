import type { Pool } from "pg";

import type { PilotRequest } from "@/lib/pilot";

/** Accepted submissions per ip_hash per rolling hour. */
export const RATE_LIMIT_PER_HOUR = 5;

export type StoredPilotRequest = PilotRequest & {
  id: string;
  createdAt: Date;
};

export type InsertResult =
  | { status: "stored"; row: StoredPilotRequest }
  | { status: "rate_limited" };

const blankToNull = (value: string) => (value === "" ? null : value);

/**
 * Store a validated request unless this ip_hash already has
 * RATE_LIMIT_PER_HOUR rows in the last hour. The count and the insert share
 * a transaction holding a per-ip_hash advisory lock, so concurrent requests
 * from one address cannot all slip under the limit.
 */
export async function insertPilotRequest(
  pool: Pool,
  request: PilotRequest,
  meta: { ipHash: string; userAgent: string | null },
): Promise<InsertResult> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [meta.ipHash]);

    const recent = await client.query<{ n: number }>(
      `SELECT count(*)::int AS n FROM pilot_requests
        WHERE ip_hash = $1 AND created_at > now() - interval '1 hour'`,
      [meta.ipHash],
    );
    if (recent.rows[0].n >= RATE_LIMIT_PER_HOUR) {
      await client.query("ROLLBACK");
      return { status: "rate_limited" };
    }

    const inserted = await client.query<{ id: string; created_at: Date }>(
      `INSERT INTO pilot_requests
         (role, chains, name, email, organisation, handle, markets, capacity, message, user_agent, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, created_at`,
      [
        request.role,
        blankToNull(request.chains),
        request.name,
        request.email,
        request.organisation,
        blankToNull(request.handle),
        blankToNull(request.markets),
        blankToNull(request.capacity),
        blankToNull(request.message),
        meta.userAgent,
        meta.ipHash,
      ],
    );
    await client.query("COMMIT");

    const { id, created_at: createdAt } = inserted.rows[0];
    return { status: "stored", row: { ...request, id: String(id), createdAt } };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
