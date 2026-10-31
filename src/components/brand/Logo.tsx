import Image from "next/image";

import { cx } from "@/lib/cx";

import styles from "./Logo.module.css";

/** The honeycomb mark. Dark and light themes use different artwork. */
export function LogoMark({ size, className }: { size: number; className?: string }) {
  return (
    <>
      <Image
        className={cx(styles.mark, "dark-only", className)}
        src="/brand/nectar-mark-dark.svg"
        alt=""
        width={size}
        height={size}
        unoptimized
      />
      <Image
        className={cx(styles.mark, "light-only", className)}
        src="/brand/nectar-mark-light.png"
        alt=""
        width={size}
        height={size}
      />
    </>
  );
}

/** "NECTAR" wordmark; the large size adds the "NETWORK" line beneath. */
export function Wordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  if (size === "sm") {
    return <span className={cx(styles.name, styles.nameSm)}>NECTAR</span>;
  }
  return (
    <span className={styles.stack}>
      <span className={cx(styles.name, styles.nameLg)}>NECTAR</span>
      <span className={styles.sub}>NETWORK</span>
    </span>
  );
}
