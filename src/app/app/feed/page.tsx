import type { Metadata } from "next";

import { AppPage, PageIntro } from "@/components/app/AppPage";
import { StatGrid } from "@/components/app/StatGrid";
import styles from "@/components/feed/Feed.module.css";
import { FeedMarkets } from "@/components/feed/FeedMarkets";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Legend } from "@/components/ui/Legend";
import { SNAPSHOT_DATE } from "@/data/markets";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Nectar Feed — exit capacity by market" },
  description:
    "How much collateral each market holds, how much a DEX can absorb, and how much buyers have committed.",
};

export default function FeedPage() {
  return (
    <AppPage>
      <PageIntro
        eyebrow="NECTAR FEED"
        title="Exit capacity by market"
        lead="How much collateral each market holds, how much a DEX can absorb, and how much buyers have committed. Observed figures and committed bids are kept separate."
        maxWidth={720}
        aside={
          <Badge tone="neutral" size="lg">
            Snapshot · {SNAPSHOT_DATE}
          </Badge>
        }
      />

      <StatGrid
        stats={[
          { label: "MARKETS OBSERVED", value: "7", note: "across 4 collateral classes" },
          {
            label: "COLLATERAL WITH MEASURED DEPTH",
            value: "$341.5M",
            note: "cirBTC and PT-reUSD, both on Morpho",
          },
          {
            label: "DEX DEPTH BEHIND IT",
            value: "$32.9M",
            note: "9.6% of that collateral",
            tone: "accent",
          },
          { label: "COMMITTED BIDS", value: "$0", note: "first buyer pending", tone: "warn" },
        ]}
      />

      <FeedMarkets />

      <Legend
        items={[
          { color: "var(--accent)", label: "DEX can absorb" },
          { color: "var(--warn-bar)", label: "Exit gap: collateral a DEX cannot absorb" },
        ]}
      >
        <span>Sources: Morpho Blue API, Aavescan, LlamaRisk, Blend mainnet events, DefiLlama.</span>
      </Legend>

      <div className={styles.bottom}>
        <Card as="section" tone="plain" gap={14} className={styles.rule} aria-labelledby="count-h">
          <h2 id="count-h" className={styles.cardTitle}>
            What counts as committed
          </h2>
          <p className={styles.cardText}>
            A bid enters the Feed only when its USDC is in escrow, it sits within [N]% of the oracle
            price, and it cannot be cancelled without [D] days of notice. Cap-setters can read the
            same number onchain.
          </p>
          <p className={styles.cardNote}>Draft rule. N and D are set with the first design partner.</p>
        </Card>
        <Card as="section" tone="accent" gap={14} className={styles.firstBid} aria-labelledby="first-h">
          <h2 id="first-h" className={styles.cardTitle}>
            Be the first bid
          </h2>
          <p className={styles.cardText}>
            Pilot buyers post funded quotes on these markets. Your USDC stays in escrow until a
            position closes or you cancel.
          </p>
          <div className={styles.ctaRow}>
            <ButtonLink href={routes.contact} size="md">
              Join the pilot as a buyer
            </ButtonLink>
            <ButtonLink href={routes.quotes} size="md" variant="secondary">
              Preview a quote
            </ButtonLink>
          </div>
        </Card>
      </div>
    </AppPage>
  );
}
