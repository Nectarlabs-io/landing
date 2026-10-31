import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Kicker, SectionHeading } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/site";

import styles from "./home.module.css";
import { Section } from "./Section";

const AUDIENCES = [
  {
    kicker: "BORROWERS, THROUGH APPS",
    title: "A higher limit, and an exit instead of a fire sale.",
    body: "Apps, brokers and agents give their borrowers more room on tokenized assets. The borrower pays a rate premium on the extra limit.",
    points: [
      "Limits from recoverable value, not a static ratio",
      "Deleveraging through committed quotes, not a cliff",
      "One integration through the agent API",
    ],
    cta: "Talk to us about your app →",
  },
  {
    kicker: "BUYERS",
    title: "Get paid to stand behind loans.",
    body: "Post funded quotes in USDC escrow with a notice period. Earn commitment fees on the size you commit, and receive collateral at a known discount when a position closes.",
    points: [
      "Prop AMMs, market makers and funds",
      "Reprice cheaply; size stays for the notice period",
      "Macaulay pricing for PTs and queued credit",
    ],
    cta: "Join the pilot as a buyer →",
  },
  {
    kicker: "LENDERS, CURATORS AND PROTOCOLS",
    title: "Raise your caps. We'll be the bid.",
    body: "Lend into markets whose collateral has committed buyers, or add exit-backed limits and funded quotes to the markets you already run.",
    points: [
      "Nectar-curated vaults for lenders",
      "A module for Morpho, Euler and Aave markets",
      "Designated, bonded keepers",
    ],
    cta: "Talk to us about your markets →",
  },
];

export function WhoItsFor() {
  return (
    <Section id="who" labelledBy="who-h">
      <SectionHeading
        id="who-h"
        eyebrow="WHO IT'S FOR"
        title="Borrowers pay for higher limits. Buyers stand behind them."
      />
      <div className={styles.cards3}>
        {AUDIENCES.map((audience) => (
          <Card key={audience.kicker} as="article" padding="32px" gap={18}>
            <Kicker tone="accent">{audience.kicker}</Kicker>
            <h3 className={styles.cardTitle}>{audience.title}</h3>
            <p className={styles.cardBody}>{audience.body}</p>
            <ul className={styles.points}>
              {audience.points.map((point) => (
                <li key={point}>
                  <span aria-hidden="true" className={styles.hex}>
                    ⬡
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link href={routes.contact} className={cx(styles.textLink, styles.pushDown)}>
              {audience.cta}
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}
