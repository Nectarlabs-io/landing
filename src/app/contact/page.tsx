import type { Metadata } from "next";

import styles from "@/components/contact/Contact.module.css";
import { PilotForm } from "@/components/contact/PilotForm";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { MiniFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Card } from "@/components/ui/Card";
import { Eyebrow, Kicker } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Talk to us — Nectar pilot cohort" },
  description:
    "Join the Nectar pilot cohort. Tell us what you're building and what you need: curators, lending protocols, buyers and builders.",
};

const NEXT_STEPS = [
  { title: "We reply by email.", text: "A real person, not a sequence." },
  {
    title: "A 30-minute call.",
    text: "Your markets, your chains, what a bad day looks like.",
  },
  {
    title: "A depth study.",
    text: "How much of your collateral a DEX can absorb, before anyone quotes capacity.",
  },
];

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar showCta={false} />
      <SiteHeader showCta={false} />
      <main className={cx(styles.main, "dotted-grid")}>
        <div className={styles.inner}>
          <div className={styles.intro}>
            <Eyebrow tone="accent" className="rise">
              TALK TO US
            </Eyebrow>
            <h1 className={cx(styles.title, "rise")} style={{ animationDelay: "0.1s" }}>
              Join the pilot cohort.
            </h1>
            <p className={cx(styles.lead, "rise")} style={{ animationDelay: "0.2s" }}>
              We&apos;re running a small, hands-on pilot with curators, lending protocols and
              buyers. Tell us what you&apos;re building and what you need.
            </p>
          </div>

          <div className={styles.columns}>
            <div className={styles.formColumn}>
              <PilotForm />
            </div>

            <aside aria-label="About the pilot" className={styles.aside}>
              <Card tone="bg" gap={18} compactOnMobile>
                <Kicker as="h2">WHAT HAPPENS NEXT</Kicker>
                <ol className={styles.nextSteps}>
                  {NEXT_STEPS.map((step, index) => (
                    <li key={step.title} className={styles.nextStep}>
                      <span aria-hidden="true" className={styles.stepNumber}>
                        {index + 1}
                      </span>
                      <span className={styles.stepText}>
                        <b>{step.title}</b> {step.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </Card>

              <Card tone="bg" gap={10} compactOnMobile className={styles.direct}>
                <Kicker as="h2">RATHER WRITE DIRECTLY?</Kicker>
                <a href={`mailto:${site.contactEmail}`} className={styles.directLink}>
                  {site.contactEmail}
                </a>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <MiniFooter />
    </>
  );
}
