import type { ReactNode } from "react";

import styles from "./Legend.module.css";

/** Colour key for bars and charts. Extra children (e.g. a sources line) follow the swatches. */
export function Legend({
  items,
  gap = 20,
  children,
}: {
  items: Array<{ color: string; label: string }>;
  gap?: number;
  children?: ReactNode;
}) {
  return (
    <div className={styles.legend} style={{ gap }}>
      {items.map((item) => (
        <span key={item.label} className={styles.item}>
          <span aria-hidden="true" className={styles.swatch} style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
      {children}
    </div>
  );
}
