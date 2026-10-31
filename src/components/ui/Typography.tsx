import type { ElementType, ReactNode } from "react";

import { cx } from "@/lib/cx";

import styles from "./Typography.module.css";

type Tone = "dim" | "accent";

const toneClass: Record<Tone, string | undefined> = {
  dim: undefined,
  accent: styles.accent,
};

/** Small uppercase line that sits above a section title. */
export function Eyebrow({
  tone = "dim",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return <p className={cx(styles.eyebrow, toneClass[tone], className)}>{children}</p>;
}

/** 11px tracked label used on cards, legends and panel headings. */
export function Kicker({
  as: Tag = "span",
  tone = "dim",
  id,
  className,
  children,
}: {
  as?: ElementType;
  tone?: Tone;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag id={id} className={cx(styles.kicker, toneClass[tone], className)}>
      {children}
    </Tag>
  );
}

export function SectionTitle({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2 id={id} className={cx(styles.title, className)}>
      {children}
    </h2>
  );
}

/** Eyebrow, h2 and optional lead paragraph, as used at the top of every home section. */
export function SectionHeading({
  id,
  eyebrow,
  eyebrowTone,
  title,
  lead,
}: {
  id: string;
  eyebrow: string;
  eyebrowTone?: Tone;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <div className={styles.head}>
      <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
      <SectionTitle id={id}>{title}</SectionTitle>
      {lead && <p className={styles.lead}>{lead}</p>}
    </div>
  );
}
