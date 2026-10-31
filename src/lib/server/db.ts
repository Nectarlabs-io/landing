import { Pool } from "pg";

import { errorCode, logEvent } from "./log";

// One pool per connection string, reused across requests in this process.
const pools = new Map<string, Pool>();

export function getPool(connectionString: string): Pool {
  let pool = pools.get(connectionString);
  if (!pool) {
    pool = new Pool({
      connectionString,
      max: 5,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
    });
    // An idle client can error (e.g. the database restarts). Without a
    // listener that would crash the process.
    pool.on("error", (error) => {
      logEvent("db_pool_error", { level: "error", code: errorCode(error) });
    });
    pools.set(connectionString, pool);
  }
  return pool;
}

/** Close every pool (tests and graceful shutdown). */
export async function closePools(): Promise<void> {
  const all = [...pools.values()];
  pools.clear();
  await Promise.all(all.map((pool) => pool.end()));
}
