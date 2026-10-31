import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./home.module.css";

/** A full-width home-page band with a 1200px content column. */
export function Section({
  id,
  labelledBy,
  className,
  innerClassName,
  children,
}: {
  id?: string;
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx(styles.section, className)}>
      <div className={cx(styles.inner, innerClassName)}>{children}</div>
    </section>
  );
}
