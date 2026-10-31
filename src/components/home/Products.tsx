import { Badge } from "@/components/ui/Badge";
import { CellGrid } from "@/components/ui/CellGrid";
import { SectionHeading } from "@/components/ui/Typography";

import styles from "./home.module.css";
import { Section } from "./Section";

const PRODUCTS: Array<{ name: string; text: string; status: "soon" | "testnet" }> = [
  {
    name: "Nectar Feed",
    text: "Committed exit capacity per asset and market, readable onchain by cap-setters.",
    status: "soon",
  },
  {
    name: "Nectar Route",
    text: "An exit source for automation and looping apps when their swaps can't clear.",
    status: "soon",
  },
  {
    name: "Nectar Exits",
    text: "Cash for lenders in fully borrowed markets, instead of waiting for repayments.",
    status: "soon",
  },
  {
    name: "Nectar Reserve",
    text: "The house buyer vault. One buyer among many, never the only one.",
    status: "testnet",
  },
  {
    name: "Nectar Keepers",
    text: "Bonded operators that watch positions and trigger routes. Losing a race returns the capital.",
    status: "testnet",
  },
  {
    name: "Launch Cover",
    text: "90 days of keepers plus a house bid for a new market.",
    status: "soon",
  },
];

export function Products() {
  return (
    <Section id="products" labelledBy="prod-h">
      <SectionHeading
        id="prod-h"
        eyebrow="PRODUCTS"
        title="Built on Pappus and Macaulay."
        lead="Two run on testnet today. The rest open to the pilot cohort first."
      />
      <CellGrid min={300}>
        {PRODUCTS.map((product) => (
          <div key={product.name} className={styles.productCell}>
            <div className={styles.productHead}>
              <span className={styles.productName}>{product.name}</span>
              {product.status === "testnet" ? (
                <Badge tone="live" size="xs">
                  Testnet
                </Badge>
              ) : (
                <Badge tone="soon" size="xs">
                  Coming soon
                </Badge>
              )}
            </div>
            <span className={styles.productText}>{product.text}</span>
          </div>
        ))}
      </CellGrid>
    </Section>
  );
}
