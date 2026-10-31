import type { CSSProperties, ElementType, HTMLAttributes } from "react";

import { cx } from "@/lib/cx";

import styles from "./CellGrid.module.css";

/**
 * Auto-fit grid whose cells are separated by 1px hairlines (the grid's
 * background shows through the gaps). Cells set their own background.
 */
export function CellGrid({
  as: Tag = "div",
  min,
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLElement> & { as?: ElementType; min: number }) {
  return (
    <Tag
      className={cx(styles.grid, className)}
      style={{ "--cell-min": `${min}px`, ...style } as CSSProperties}
      {...rest}
    />
  );
}
