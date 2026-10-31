import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Kicker, SectionHeading } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/site";

import styles from "./home.module.css";
import { Section } from "./Section";

const AUDIENCES = [
  {
    kicker: "CURATORS AND PROTOCOLS",
    title: "Raise your caps. We'll be the bid.",
    body: "Committed exit capacity for each collateral you list, published onchain so risk managers can size caps against it.",
    points: ["Nectar Feed per market", "Launch Cover for new markets", "Designated, bonded keepers"],
    cta: "Talk to us about your markets →",
  },
  {
    kicker: "BUYERS",
    title: "Buy collateral at a known price.",
    body: "Post a funded quote once. Your USDC sits in escrow and backs one live quote at a time; you receive collateral only when a position closes.",
    points: [
      "Macaulay pricing for PTs and queued credit",
      "Partial fills, size caps, expiry",
      "Cancel any time, with notice",
    ],
    cta: "Join the pilot as a buyer →",
  },
  {
    kicker: "APPS AND LENDERS",
    title: "An exit when the pool runs dry.",
    body: "Automation and looping apps route thin-collateral repays through Nectar. Lenders in fully borrowed markets turn stuck positions into cash.",
    points: [
      "Nectar Route for automation apps",
      "Nectar Exits for lenders",
      "One integration for every market we cover",
    ],
    cta: "Talk to us about integrating →",
  },
];

export function WhoItsFor() {
  return (
    <Section id="who" labelledBy="who-h">
      <SectionHeading
        id="who-h"
        eyebrow="WHO IT'S FOR"
        title="Curators pay for capacity. Buyers supply it."
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
