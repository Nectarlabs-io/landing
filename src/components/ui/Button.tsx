import type { ComponentPropsWithoutRef } from "react";

import { cx } from "@/lib/cx";

import styles from "./Button.module.css";
import { SmartLink, type SmartLinkProps } from "./SmartLink";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

type StyleProps = {
  variant?: Variant;
  size?: Size;
  block?: boolean;
};

export function buttonClass({
  variant = "primary",
  size = "lg",
  block = false,
}: StyleProps = {}): string {
  return cx(styles.button, styles[variant], styles[size], block && styles.block);
}

export function ButtonLink({
  variant,
  size,
  block,
  className,
  ...rest
}: SmartLinkProps & StyleProps) {
  return (
    <SmartLink
      className={cx(buttonClass({ variant, size, block }), className)}
      {...rest}
    />
  );
}

export function Button({
  variant,
  size,
  block,
  className,
  type = "button",
  ...rest
}: ComponentPropsWithoutRef<"button"> & StyleProps) {
  return (
    <button
      type={type}
      className={cx(buttonClass({ variant, size, block }), className)}
      {...rest}
    />
  );
}
