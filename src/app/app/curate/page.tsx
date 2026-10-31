import type { Metadata } from "next";
import Link from "next/link";

import { AppPage, PageIntro } from "@/components/app/AppPage";
import styles from "@/components/curate/Curator.module.css";
import { CuratorConsole } from "@/components/curate/CuratorConsole";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Curator console — size exit capacity" },
  description:
    "See how much of a market's collateral a DEX can absorb, and request committed capacity for the rest.",
};

const FEATURES = [
  {
    title: "An onchain capacity number",
    text: "Your market's committed bids appear in Nectar Feed, readable by your risk team and any cap-setter.",
  },
  {
    title: "Designated keepers",
    text: "Bonded Nectar keepers watch every position in the market and route each to the exit that can absorb it.",
  },
  {
    title: "A monthly exit report",
    text: "Fill rates, realised slippage, failures and time to exit, with observed results kept apart from simulations.",
  },
];

export default function CuratePage() {
  return (
    <AppPage>
      <PageIntro
        eyebrow="CURATOR CONSOLE"
        title="Raise your caps. We'll be the bid."
        lead="Pick a market you curate, see how much of its collateral a DEX can absorb, and request committed capacity for the rest. Pilot curators see their own vaults' markets here."
        aside={
          <Badge tone="dashed" size="lg">
            Showing public markets
          </Badge>
        }
      />

      <CuratorConsole />

      <div className={styles.features}>
        {FEATURES.map((feature) => (
          <Card key={feature.title} tone="plain" padding="24px" gap={8}>
            <h3 className={styles.featureTitle}>{feature.title}</h3>
            <span className={styles.featureText}>{feature.text}</span>
          </Card>
        ))}
        <Card tone="accent" padding="24px" gap={8}>
          <div className={styles.featureHead}>
            <h3 className={styles.featureTitle}>Launch Cover</h3>
            <Badge tone="soon" size="xs">
              Coming soon
            </Badge>
          </div>
          <span className={styles.featureText}>
            Listing a new market or chain? 90 days of keepers plus a house bid while organic buyers
            arrive.
          </span>
          <Link href={routes.contact} className={styles.featureLink}>
            Ask about Launch Cover →
          </Link>
        </Card>
      </div>
    </AppPage>
  );
}
