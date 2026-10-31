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
        lead="Buyers commit USDC in escrow before the storm, and lending markets count those quotes when they set limits. When a position goes bad, keepers flag it and the router checks depth. If the pool is too thin, Pappus settles against committed quotes in one transaction, with Nectar Reserve filling last."
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
