import { Dot } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";
import { site } from "@/lib/site";

import styles from "./home.module.css";
import { Section } from "./Section";

export function Security() {
  return (
    <Section id="security" labelledBy="sec-h">
      <SectionHeading
        id="sec-h"
        eyebrow="SECURITY"
        title="Open by default. Thin by design."
        lead="Infrastructure that moves other people's collateral is judged by its security record first."
      />
      <div className={styles.cards4}>
        <Card tone="plain" gap={10}>
          <span className={styles.smallTitle}>Open source</span>
          <span className={styles.smallText}>
            Every contract and the keeper daemon are public under the MIT license.
          </span>
          <a href={site.githubUrl} className={cx(styles.textLink, styles.pushDown)}>
            GitHub →
          </a>
        </Card>
        <Card tone="plain" gap={10}>
          <span className={styles.smallTitle}>Thin core</span>
          <span className={styles.smallText}>
            Markets, escrow and settlement are separate, minimal contracts. Pricing risk sits with
            buyers, and Nectar Reserve is never the only bid a limit counts on.
          </span>
        </Card>
        <Card tone="plain" gap={10}>
          <span className={styles.smallTitle}>USDC bonds</span>
          <span className={styles.smallText}>
            Keepers bond USDC, never a volatile token. A draw not returned in time is slashed to the
            vault.
          </span>
        </Card>
        <Card tone="plain" gap={10}>
          <span className={styles.smallTitle}>Audit</span>
          <span className={styles.smallText}>
            Core contracts: audit in process. The report is published here when it closes.
          </span>
          <span className={styles.auditStatus}>
            <Dot tone="warn" pulse />
            In process
          </span>
        </Card>
      </div>
    </Section>
  );
}
