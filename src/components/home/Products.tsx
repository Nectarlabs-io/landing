import { Badge } from "@/components/ui/Badge";
import { CellGrid } from "@/components/ui/CellGrid";
import { SectionHeading } from "@/components/ui/Typography";

import styles from "./home.module.css";
import { Section } from "./Section";

const PRODUCTS = [
  {
    name: "Nectar Feed",
    text: "Committed exit capacity per asset and market, readable onchain by cap-setters.",
  },
  {
    name: "Nectar Route",
    text: "An exit source for automation and looping apps when their swaps can't clear.",
  },
  {
    name: "Nectar Exits",
    text: "Cash for lenders in fully borrowed markets, instead of waiting for repayments.",
  },
  {
    name: "Nectar Reserve",
    text: "The house buyer vault. One buyer among many, never the only one.",
  },
  {
    name: "Nectar Keepers",
    text: "Bonded operators that watch positions and trigger routes. Losing a race returns the capital.",
  },
  {
    name: "Launch Cover",
    text: "90 days of keepers plus a house bid for a new market.",
  },
];

export function Products() {
  return (
    <Section id="products" labelledBy="prod-h">
      <SectionHeading
        id="prod-h"
        eyebrow="PRODUCTS"
        title="Built on Pappus and Macaulay."
        lead="All in development. Pilot partners get them first."
      />
      <CellGrid min={300}>
        {PRODUCTS.map((product) => (
          <div key={product.name} className={styles.productCell}>
            <div className={styles.productHead}>
              <span className={styles.productName}>{product.name}</span>
              <Badge tone="soon" size="xs">
                Coming soon
              </Badge>
            </div>
            <span className={styles.productText}>{product.text}</span>
          </div>
        ))}
      </CellGrid>
    </Section>
  );
}
