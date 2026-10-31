import type { ComponentPropsWithoutRef } from "react";

import { cx } from "@/lib/cx";

import styles from "./Button.module.css";
import { SmartLink, type SmartLinkProps } from "./SmartLink";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

type StyleProps = {
  variant?: Variant;
  size?: Size;
};

export function buttonClass({ variant = "primary", size = "lg" }: StyleProps = {}): string {
  return cx(styles.button, styles[variant], styles[size]);
}

export function ButtonLink({ variant, size, className, ...rest }: SmartLinkProps & StyleProps) {
  return <SmartLink className={cx(buttonClass({ variant, size }), className)} {...rest} />;
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...rest
}: ComponentPropsWithoutRef<"button"> & StyleProps) {
  return (
    <button type={type} className={cx(buttonClass({ variant, size }), className)} {...rest} />
  );
}
