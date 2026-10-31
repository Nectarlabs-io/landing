import type { CSSProperties, ReactNode } from "react";

import { Kicker } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";

import styles from "./AppChrome.module.css";

/** <main> with the 1320px app column. */
export function AppPage({
  gap = 32,
  snug = false,
  children,
}: {
  /** Vertical gap between page blocks, in px. */
  gap?: number;
  /** Less space above the first block (the quote form starts with a back link). */
  snug?: boolean;
  children: ReactNode;
}) {
  return (
    <main className={cx(styles.main, snug && styles.mainSnug)}>
      <div className={styles.inner} style={{ "--page-gap": `${gap}px` } as CSSProperties}>
        {children}
      </div>
    </main>
  );
}

/** Kicker, h1 and lead at the top of an app page, with an optional badge on the right. */
export function PageIntro({
  eyebrow,
  title,
  lead,
  aside,
  maxWidth = 760,
  size = "md",
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  aside?: ReactNode;
  maxWidth?: number;
  size?: "sm" | "md";
}) {
  const intro = (
    <div className={styles.intro} style={{ maxWidth }}>
      <Kicker as="p">{eyebrow}</Kicker>
      <h1 className={cx(styles.title, size === "sm" && styles.titleSm)}>{title}</h1>
      <p className={styles.lead}>{lead}</p>
    </div>
  );

  if (!aside) return intro;

  return (
    <div className={styles.introRow}>
      {intro}
      {aside}
    </div>
  );
}
