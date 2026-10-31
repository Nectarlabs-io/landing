import { CellGrid } from "@/components/ui/CellGrid";
import { SectionHeading } from "@/components/ui/Typography";

import styles from "./home.module.css";
import { Section } from "./Section";

const STATS = [
  {
    value: "$274M",
    text: "of cirBTC collateral on Morpho sits behind about $24M of DEX liquidity.",
    source: "Oct 25, 2026 · Morpho API",
  },
  {
    value: "$36.1M",
    text: "of Morpho loans liquidated in 14 minutes after one wallet sold into an $8.97M Pendle pool.",
    source: "Aug 25, 2026 · PT-reUSD",
  },
  {
    value: "100%",
    text: "utilization on Aave's WETH pool after the Kelp exploit. Lenders could not withdraw.",
    source: "Apr 2026 · Aave V3",
  },
  {
    value: "30M",
    text: "PT-AUSD supply cap filled on an Aave market. Exit still depends on buyers or redemption.",
    source: "Oct 9, 2026 · LlamaRisk",
  },
];

export function Problem() {
  return (
    <Section labelledBy="problem-h">
      <SectionHeading
        id="problem-h"
        eyebrow="THE PROBLEM"
        title="Every loan assumes a buyer. On a calm day, nobody checks."
        lead="When prices gap, DEX pools thin and bots take the easy positions. Unsold collateral becomes bad debt, so curators keep caps low."
      />
      <CellGrid min={240}>
        {STATS.map((stat) => (
          <div key={stat.value} className={styles.statCell}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statText}>{stat.text}</span>
            <span className={styles.statSource}>{stat.source}</span>
          </div>
        ))}
      </CellGrid>
    </Section>
  );
}
