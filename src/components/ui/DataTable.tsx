import type { ComponentPropsWithoutRef } from "react";

import { cx } from "@/lib/cx";

import styles from "./DataTable.module.css";

/**
 * Wide data table that becomes a stack of label/value cards on phones.
 * Every <td> after the first needs a data-label for its mobile caption.
 */
export function DataTable({
  minWidth,
  className,
  style,
  ...rest
}: ComponentPropsWithoutRef<"table"> & {
  /** Below this width the table scrolls horizontally (desktop and tablet). */
  minWidth: number;
}) {
  return (
    <div className={cx(styles.wrap, className)}>
      <table className={styles.table} style={{ minWidth, ...style }} {...rest} />
    </div>
  );
}

/** Class helpers for cells. */
export const cell = {
  strong: styles.strong,
};
