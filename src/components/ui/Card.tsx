import type { CSSProperties, ElementType, HTMLAttributes } from "react";

import { cx } from "@/lib/cx";

import styles from "./Card.module.css";

type Tone = "plain" | "surface" | "bg";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  tone?: Tone;
  /** CSS padding shorthand, e.g. "28px" or "20px 24px". */
  padding?: string;
  /** Vertical gap between children, in px. */
  gap?: number;
  /** Tighten padding to 20px 16px on phones. */
  compactOnMobile?: boolean;
};

export function Card({
  as: Tag = "div",
  tone = "surface",
  padding,
  gap,
  compactOnMobile = false,
  className,
  style,
  ...rest
}: CardProps) {
  const vars = {
    ...(padding ? { "--card-pad": padding } : null),
    ...(gap != null ? { "--card-gap": `${gap}px` } : null),
    ...style,
  } as CSSProperties;

  return (
    <Tag
      className={cx(styles.card, styles[tone], compactOnMobile && styles.compact, className)}
      style={vars}
      {...rest}
    />
  );
}
