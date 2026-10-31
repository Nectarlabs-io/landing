import type { ReactNode } from "react";

import { CellGrid } from "@/components/ui/CellGrid";
import { cx } from "@/lib/cx";

import styles from "./AppChrome.module.css";

export type Stat = {
  label: string;
  value: ReactNode;
  note: ReactNode;
  tone?: "accent" | "warn";
  noteTone?: "warn";
  /** Smaller value type for long values such as contract names. */
  small?: boolean;
};

/** Row of headline figures separated by hairlines. */
export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <CellGrid min={220}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.stat}>
          <span className={styles.statLabel}>{stat.label}</span>
          <span
            className={cx(
              styles.statValue,
              stat.small && styles.statValueSmall,
              stat.tone && styles[stat.tone],
            )}
          >
            {stat.value}
          </span>
          <span className={cx(styles.statNote, stat.noteTone && styles[stat.noteTone])}>
            {stat.note}
          </span>
        </div>
      ))}
    </CellGrid>
  );
}
