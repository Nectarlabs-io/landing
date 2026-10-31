import type { ComponentPropsWithoutRef } from "react";

import { cx } from "@/lib/cx";

import styles from "./DataTable.module.css";

type Density = "roomy" | "standard" | "cozy" | "compact";

export function DataTable({
  minWidth,
  density = "standard",
  headerBg = false,
  cardsOnBg = false,
  className,
  style,
  ...rest
}: ComponentPropsWithoutRef<"table"> & {
  /** Below this width the table scrolls horizontally (desktop and tablet). */
  minWidth: number;
  density?: Density;
  /** Tint the header row with the surface colour. */
  headerBg?: boolean;
  /** Use the page background for mobile row cards (for tables inside a surface panel). */
  cardsOnBg?: boolean;
}) {
  return (
    <div className={cx(styles.wrap, styles[density], cardsOnBg && styles.cardsOnBg, className)}>
      <table
        className={cx(styles.table, headerBg && styles.headerBg)}
        style={{ minWidth, ...style }}
        {...rest}
      />
    </div>
  );
}

/** Class helpers for cells. */
export const cell = {
  num: styles.num,
  nowrap: styles.nowrap,
  strong: styles.strong,
  dim: styles.dim,
  warn: styles.warn,
  accent: styles.accent,
};
