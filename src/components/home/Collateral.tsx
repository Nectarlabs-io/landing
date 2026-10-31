import Link from "next/link";

import { DataTable, cell } from "@/components/ui/DataTable";
import { SectionHeading } from "@/components/ui/Typography";
import { routes } from "@/lib/site";

import styles from "./home.module.css";
import { Section } from "./Section";

const CLASSES = [
  {
    name: "Wrapped BTC",
    venues: "Morpho (cirBTC)",
    problem: "DEX depth far below collateral",
  },
  {
    name: "Principal tokens",
    venues: "Morpho, Aave, Euler",
    problem: "One thin Pendle pool until maturity",
  },
  {
    name: "Tokenized stocks",
    venues: "Aave V4 Equities Hub, Morpho, Kamino",
    problem: "Weekend price gaps, issuer pauses",
  },
  {
    name: "Credit and RWA tokens",
    venues: "Aave V4, Morpho, Blend",
    problem: "Redemption queues, sometimes cross-chain",
  },
  {
    name: "LSTs and LRTs",
    venues: "Aave, Morpho, Lido Lend",
    problem: "Withdrawal queues",
  },
];

export function Collateral() {
  return (
    <Section labelledBy="coll-h" innerClassName={styles.innerTight}>
      <SectionHeading
        id="coll-h"
        eyebrow="COLLATERAL"
        title="Built once per collateral class. Shipped wherever it's listed."
      />
      <DataTable minWidth={760} density="roomy" aria-labelledby="coll-h">
        <thead>
          <tr>
            <th scope="col">CLASS</th>
            <th scope="col">WHERE IT&apos;S BORROWED AGAINST</th>
            <th scope="col">EXIT PROBLEM</th>
          </tr>
        </thead>
        <tbody>
          {CLASSES.map((row) => (
            <tr key={row.name}>
              <td className={cell.strong}>{row.name}</td>
              <td data-label="BORROWED AGAINST">{row.venues}</td>
              <td data-label="EXIT PROBLEM">{row.problem}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>
      <p className={styles.footnote}>
        Your collateral isn&apos;t here? <Link href={routes.contact}>Talk to us.</Link>
      </p>
    </Section>
  );
}
