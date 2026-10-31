import type { ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./Badge.module.css";

type Tone = "soon" | "neutral";
type Size = "xs" | "sm";

export function Badge({
  tone = "neutral",
  size = "sm",
  className,
  children,
}: {
  tone?: Tone;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return <span className={cx(styles.badge, styles[tone], styles[size], className)}>{children}</span>;
}

/** Small status dot. `pulse` adds the radiating ring animation. */
export function Dot({
  tone = "accent",
  pulse = false,
}: {
  tone?: "accent" | "warn";
  pulse?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cx(styles.dot, tone === "warn" && styles.dotWarn, pulse && "pulse")}
    />
  );
}
