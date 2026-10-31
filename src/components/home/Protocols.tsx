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
      { term: "Scope", detail: "Settlement and escrow only; risk sits with buyers and curators" },
      { term: "Escrow", detail: "One dollar backs one live quote" },
    ],
    etymology: "Named for Pappus of Alexandria, who explained why bees build hexagonal cells.",
  },
  {
    name: "Macaulay",
    summary:
      "Buyers for collateral that redeems later. Quotes are priced against redemption value and time to it, and buyers hold to settlement instead of selling into the pool that caused the fall.",
    facts: [
      { term: "Covers", detail: "PTs, queued credit tokens, LRTs, weekend stock gaps" },
      { term: "Pricing", detail: "Yield to redemption, not DEX price" },
      {
        term: "Limits",
        detail: "Only underlyings a curator already accepts; exposure capped per issuer",
      },
    ],
    etymology: "Named for Macaulay duration: for a PT, it equals the time to maturity.",
  },
];

export function Protocols() {
  return (
    <Section id="protocols" labelledBy="proto-h">
      <SectionHeading
        id="proto-h"
        eyebrow="PROTOCOLS"
        title="Two protocols underneath."
        lead="A thin core that settles, and a pricing layer for collateral that redeems later. Everything else is a product built on them."
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
    </Section>
  );
}
