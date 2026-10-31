import type { CSSProperties } from "react";

import { Badge } from "@/components/ui/Badge";
import { Eyebrow, Kicker, SectionTitle } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";

import styles from "./home.module.css";
import { Section } from "./Section";

const POINTS = [
  "Buyers can reprice cheaply but can't pull size before their notice period ends.",
  "Borrowing above a static limit carries a rate premium, which pays buyers a commitment fee.",
  "When quotes leave, new borrowing shrinks first. Existing loans deleverage through the remaining quotes instead of hitting a liquidation cliff.",
];

// The example card's numbers are illustrative, not measured.
const EXAMPLE_LABEL =
  "Illustrative example: on $10.0M of collateral, a static 60% limit allows $6.0M. Recoverable value is $8.5M, or $7.65M after a 10% haircut, so the limit is $7.65M, the lower of that and an $8.0M oracle limit.";

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

function Bar({
  label,
  value,
  width,
  fill,
  wait,
}: {
  label: string;
  value: string;
  width: string;
  fill: string;
  wait: number;
}) {
  return (
    <div className={styles.meter}>
      <div className={styles.meterLabel}>
        <span>{label}</span>
        <span className={cx(styles.meterValue, styles.tabular)}>{value}</span>
      </div>
      <div className={styles.limitTrack}>
        <div className={cx(styles.limitFill, "grow")} style={{ width, background: fill, ...delay(wait) }} />
      </div>
    </div>
  );
}

export function BorrowingLimits() {
  return (
    <Section id="limits" labelledBy="limits-h" innerClassName={styles.limitsSplit}>
      <div className={styles.limitsCopy}>
        <Eyebrow>BORROWING LIMITS</Eyebrow>
        <SectionTitle id="limits-h">Borrowing limits backed by committed buyers.</SectionTitle>
        <p className={styles.lead}>
          A lending market can only lend what it can recover. Nectar caps borrowing against each
          asset at the lower of the usual oracle limit and its recoverable value: committed
          buyers&apos; quotes, Nectar Reserve&apos;s quotes and verified DEX depth, minus a haircut.
          More committed buyers mean higher limits.
        </p>
        <p className={styles.formula}>
          limit = min( oracle LTV × value,
          <br />
          (1 − haircut) × (committed quotes + Reserve quotes + DEX depth) )
        </p>
        <ul className={styles.limitPoints}>
          {POINTS.map((point) => (
            <li key={point}>
              <span aria-hidden="true" className={styles.hex}>
                ⬡
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <figure aria-label={EXAMPLE_LABEL} className={styles.exampleCard}>
        <div className={styles.cardHead}>
          <Kicker>EXAMPLE</Kicker>
          <Badge tone="neutral">Illustrative numbers</Badge>
        </div>
        <span className={styles.exampleTitle}>$10.0M of a tokenized asset</span>

        <Bar label="Static limit at 60% LTV" value="$6.0M" width="60%" fill="var(--border-strong)" wait={0.1} />
        <Bar label="Oracle limit at 80% LTV" value="$8.0M" width="80%" fill="var(--dim)" wait={0.2} />

        <div className={styles.meter}>
          <div className={styles.meterLabel}>
            <span>Recoverable value</span>
            <span className={cx(styles.meterValue, styles.tabular)}>$8.5M</span>
          </div>
          <div className={cx(styles.limitTrack, styles.stacked)}>
            <div className={cx(styles.limitSegment, styles.committed, "grow")} style={{ width: "50%", ...delay(0.3) }} />
            <div className={cx(styles.limitSegment, styles.reserve, "grow")} style={{ width: "15%", ...delay(0.45) }} />
            <div className={cx(styles.limitSegment, styles.depth, "grow")} style={{ width: "20%", ...delay(0.6) }} />
          </div>
          <div className={styles.legend}>
            <span>
              <span aria-hidden="true" className={cx(styles.swatch, styles.committed)} />
              Committed quotes $5.0M
            </span>
            <span>
              <span aria-hidden="true" className={cx(styles.swatch, styles.reserve)} />
              Nectar Reserve $1.5M
            </span>
            <span>
              <span aria-hidden="true" className={cx(styles.swatch, styles.depth)} />
              DEX depth $2.0M
            </span>
          </div>
        </div>

        <Bar label="Nectar limit, after a 10% haircut" value="$7.65M" width="76.5%" fill="var(--accent)" wait={0.75} />

        <figcaption className={styles.exampleCaption}>
          The limit is the lower of $8.0M and $7.65M. That&apos;s $1.65M more than the static limit;
          the borrower pays a premium on the extra, and the premium funds buyers&apos; commitment
          fees.
        </figcaption>
      </figure>
    </Section>
  );
}
