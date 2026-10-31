import type { Metadata } from "next";
import Link from "next/link";

import { AppPage, PageIntro } from "@/components/app/AppPage";
import styles from "@/components/quote/Quote.module.css";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";
import { cx } from "@/lib/cx";
import { routes } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Post a funded quote — Macaulay" },
  description:
    "Price collateral against what it redeems for, not the pool it trades in. Preview a Macaulay quote.",
};

const STEPS = ["Market", "Price", "Terms", "Escrow"];
const CURRENT_STEP = 2;

export default function QuotePage() {
  return (
    <AppPage gap={28} snug>
      <Link href={routes.feed} className={styles.back}>
        ← Back to Feed
      </Link>

      <PageIntro
        eyebrow="MACAULAY · NEW QUOTE"
        title="Post a funded quote"
        lead="Price the collateral against what it redeems for, not against the pool it trades in. Your USDC backs this quote alone and stays yours until a position closes or you cancel."
        size="sm"
      />

      <ol aria-label="Steps" className={styles.steps}>
        {STEPS.map((step, index) => {
          const number = index + 1;
          return (
            <li
              key={step}
              className={cx(styles.step, number <= CURRENT_STEP && styles.stepReached)}
              aria-current={number === CURRENT_STEP ? "step" : undefined}
            >
              {number} · {step}
            </li>
          );
        })}
      </ol>

      <QuoteBuilder />
    </AppPage>
  );
}
