import type { CSSProperties } from "react";

import { Badge, Dot } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow, Kicker } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/site";

import { CountUp } from "./CountUp";
import styles from "./home.module.css";

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

export function Hero() {
  return (
    <section className={cx(styles.hero, "dotted-grid")}>
      <div className={cx(styles.inner, styles.split)}>
        <div className={styles.heroCopy}>
          <Eyebrow tone="accent" className="rise">
            EXIT INFRASTRUCTURE FOR GLOBAL CREDIT
          </Eyebrow>
          <h1 className={styles.heroTitle}>
            <span className={cx(styles.heroWord, "rise")} style={delay(0.08)}>
              The buyer
            </span>{" "}
            <span className={cx(styles.heroWord, "rise")} style={delay(0.2)}>
              behind every
            </span>{" "}
            <span className={cx(styles.heroWord, "rise")} style={delay(0.32)}>
              loan.
            </span>
          </h1>
          <p className={cx(styles.heroLead, "rise")} style={delay(0.45)}>
            Nectar lines up funded buyers for lending-market collateral, so positions close even
            when DEX liquidity can&apos;t absorb them. Curators raise caps. Lenders get repaid.
          </p>
          <div className={cx(styles.actions, "rise")} style={delay(0.55)}>
            <ButtonLink href={routes.contact}>Join the pilot</ButtonLink>
            <ButtonLink href="#how" variant="secondary">
              See how it works ↓
            </ButtonLink>
          </div>
          <p className={cx(styles.statusLine, "rise")} style={delay(0.65)}>
            <Dot pulse />
            In development · pilot cohort forming
          </p>
        </div>

        <ExitCapacityCard />
      </div>
    </section>
  );
}

function ExitCapacityCard() {
  return (
    <Card
      tone="surface"
      padding="28px"
      gap={22}
      className={cx(styles.capacityCard, "rise")}
      style={delay(0.3)}
    >
      <div className={styles.cardHead}>
        <Kicker>EXIT CAPACITY</Kicker>
        <Badge tone="neutral">Observed Oct 25, 2026</Badge>
      </div>

      <div className={styles.pair}>
        <span className={styles.pairName}>cirBTC / USDC</span>
        <span className={styles.meta}>Morpho · LLTV 86%</span>
      </div>

      <div className={styles.meters}>
        <div className={styles.meter}>
          <div className={styles.meterLabel}>
            <span>Collateral at stake</span>
            <span className={styles.meterValue}>$274.0M</span>
          </div>
          <div className={styles.track}>
            <div
              className={cx(styles.fill, "grow")}
              style={{ width: "100%", background: "var(--border-strong)" }}
            />
          </div>
        </div>
        <div className={styles.meter}>
          <div className={styles.meterLabel}>
            <span>DEX liquidity</span>
            <span className={styles.meterValue}>≈ $23.9M</span>
          </div>
          <div className={styles.track}>
            <div
              className={cx(styles.fill, "grow")}
              style={{ width: "8.7%", background: "var(--accent)", animationDelay: "0.9s" }}
            />
          </div>
        </div>
        <div className={styles.meter}>
          <div className={styles.meterLabel}>
            <span>Committed bids</span>
            <span className={styles.meterValueWarn}>first buyers in the pilot</span>
          </div>
          <div className={styles.pending} />
        </div>
      </div>

      <div className={styles.gapRow}>
        <span className={styles.meta}>Exit gap</span>
        <span className={styles.gapValue}>
          <CountUp value={250.1} decimals={1} prefix="$" suffix="M" />
        </span>
      </div>

      <p className={styles.cardNote}>
        Nectar fills the gap with funded quotes held in USDC escrow. Nectar Feed will publish this
        for every market it covers. Coming soon.
      </p>
    </Card>
  );
}
