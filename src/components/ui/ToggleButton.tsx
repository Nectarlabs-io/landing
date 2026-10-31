import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./ToggleButton.module.css";

type Shape = "option" | "optionTight" | "chip";

/** A pressable option in a single-choice group (aria-pressed). */
export function ToggleButton({
  pressed,
  shape = "option",
  count,
  className,
  children,
  ...rest
}: Omit<ComponentPropsWithoutRef<"button">, "type"> & {
  pressed: boolean;
  shape?: Shape;
  /** Optional trailing count, as on the Feed filter chips. */
  count?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx(styles.toggle, styles[shape], className)}
      {...rest}
    >
      {children}
      {count != null && <span className={styles.count}>{count}</span>}
    </button>
  );
}
