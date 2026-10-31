import { Fragment } from "react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";

import styles from "./home.module.css";
import { Section } from "./Section";

const PROTOCOLS = [
  {
    name: "Pappus",
    summary:
      "Settlement and quote escrow. Repays debt with the buyer's USDC and delivers the collateral in one transaction.",
    facts: [
      { term: "Scope", detail: "Settlement and escrow only; markets are separate contracts" },
      { term: "Quotes", detail: "Oracle-referenced price, size committed for a notice period" },
      { term: "Escrow", detail: "One dollar backs one live quote" },
    ],
    etymology: "Named for Pappus of Alexandria, who explained why bees build hexagonal cells.",
  },
  {
    name: "Macaulay",
    summary:
      "Buyers for collateral that redeems later. Quotes are priced against redemption value and time to it, and buyers hold to settlement instead of selling into the pool that caused the fall.",
    facts: [
      { term: "Covers", detail: "PTs, queued credit tokens, LRTs, assets that trade in market hours" },
      { term: "Pricing", detail: "Yield to redemption, not DEX price" },
      {
        term: "Limits",
        detail: "Only underlyings a curator already accepts; exposure capped per issuer",
      },
    ],
    etymology: "Named for Macaulay duration: for a PT, it equals the time to maturity.",
  },
];

// Described by what they do; only Pappus and Macaulay have public names.
const IN_DESIGN = [
  {
    name: "Exit-backed lending markets",
    text: "Lending markets that cap borrowing at recoverable value and charge a premium for the extra limit. Lenders deposit through Nectar-curated vaults.",
  },
  {
    name: "Reserve quoting engine",
    text: "Prices the collateral Nectar lends against, so Nectar Reserve can quote it and stand as the buyer of last resort.",
  },
];

export function Protocols() {
  return (
    <Section id="protocols" labelledBy="proto-h">
      <SectionHeading
        id="proto-h"
        eyebrow="PROTOCOLS"
        title="The protocols underneath."
        lead="A thin settlement core, a pricing layer for collateral that redeems later, and two more in design. Everything else is a product built on them."
      />
      <div className={styles.cards2}>
        {PROTOCOLS.map((protocol) => (
          <Card key={protocol.name} as="article" padding="36px" gap={20}>
            <div className={styles.protocolHead}>
              <h3 className={styles.protocolName}>{protocol.name}</h3>
              <Badge tone="soon">Coming soon</Badge>
            </div>
            <p className={styles.cardBody}>{protocol.summary}</p>
            <dl className={styles.facts}>
              {protocol.facts.map((fact) => (
                <Fragment key={fact.term}>
                  <dt>{fact.term}</dt>
                  <dd>{fact.detail}</dd>
                </Fragment>
              ))}
            </dl>
            <p className={styles.etymology}>{protocol.etymology}</p>
          </Card>
        ))}
      </div>
      <div className={styles.designCards}>
        {IN_DESIGN.map((item) => (
          <article key={item.name} className={styles.designCard}>
            <div className={styles.protocolHead}>
              <h3 className={styles.designName}>{item.name}</h3>
              <Badge tone="neutral">In design</Badge>
            </div>
            <p className={styles.cardBody}>{item.text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
