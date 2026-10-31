import { LogoMark } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cx } from "@/lib/cx";
import { routes, site } from "@/lib/site";

import styles from "./home.module.css";
import { Section } from "./Section";

export function ClosingCta() {
  return (
    <Section
      id="contact"
      labelledBy="cta-h"
      className={cx(styles.closing, "dotted-grid")}
      innerClassName={styles.closingInner}
    >
      <LogoMark size={72} className="float" />
      <h2 id="cta-h" className={styles.closingTitle}>
        Every loan needs a buyer. Nectar makes sure there is one.
      </h2>
      <p className={styles.closingLead}>
        Liquidity that&apos;s there when the market isn&apos;t. The pilot cohort is small and
        hands-on: buyer, lender, curator or app, tell us what you need.
      </p>
      <div className={cx(styles.actions, styles.closingActions)}>
        <ButtonLink href={routes.contact}>Talk to us</ButtonLink>
        <ButtonLink href={site.docsUrl} variant="secondary">
          Read the docs
        </ButtonLink>
      </div>
      <p className={styles.closingTagline}>Stored in summer, there in winter.</p>
    </Section>
  );
}
