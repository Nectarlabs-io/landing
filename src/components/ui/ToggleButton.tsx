import type { ComponentPropsWithoutRef } from "react";

import { cx } from "@/lib/cx";

import styles from "./ToggleButton.module.css";

/** A pressable option in a single-choice group (aria-pressed). */
export function ToggleButton({
  pressed,
  className,
  ...rest
}: Omit<ComponentPropsWithoutRef<"button">, "type"> & { pressed: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cx(styles.toggle, className)}
      {...rest}
    />
  );
}
