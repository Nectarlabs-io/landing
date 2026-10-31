import Link from "next/link";

import { SectionHeading } from "@/components/ui/Typography";
import { visiblePage } from "@/lib/content/load";

import { ArchitectureDiagram } from "./ArchitectureDiagram";
import styles from "./home.module.css";
import { Section } from "./Section";

export function HowItWorks() {
  return (
    <Section id="how" labelledBy="how-h" innerClassName={styles.innerTight}>
      <SectionHeading
        id="how-h"
        eyebrow="HOW IT WORKS"
        title="Every position closes through the route that can absorb it."
        lead="Keepers flag the position. The router checks DEX depth. If it's too thin, Pappus settles against a buyer's funded quote in one transaction, and the Feed publishes how much capacity is committed."
      />
      <ArchitectureDiagram />
      <p className={styles.footnote}>
        Every part of this flow is in development. Pilot partners see it first.
        {visiblePage("/how-it-works") && (
          <>
            {" "}
            <Link href="/how-it-works">Read the full walkthrough →</Link>
          </>
        )}
      </p>
    </Section>
  );
}
