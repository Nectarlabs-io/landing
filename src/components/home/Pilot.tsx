import Image from "next/image";
import Link from "next/link";

import honeycombDark from "@/assets/illustrations/honeycomb-dark.webp";
import honeycombLight from "@/assets/illustrations/honeycomb-light.webp";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, SectionTitle } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";
import { routes, site } from "@/lib/site";

import styles from "./home.module.css";
import { Section } from "./Section";

const PERKS = [
  { title: "Commitment fees", text: "For buyers who commit size behind a market" },
  { title: "Higher limits", text: "For lenders and apps, backed by those buyers" },
  { title: "A depth study", text: "How much a DEX can absorb, before anyone counts it" },
  { title: "A say in the rules", text: "Haircuts, notice periods and how bids get counted" },
];

const ART_ALT =
  "Honeycomb illustration: a cluster of lit cells around a nectar droplet, droplets falling in, dashed amber cells at the edges";

// The artwork is drawn at 170% of the frame and cropped by the radial mask.
const ART_SIZES = "(max-width: 760px) 170vw, 952px";

export function Pilot() {
  return (
    <Section id="pilot" labelledBy="pilot-h" innerClassName={styles.split}>
      <div className={styles.pilotCopy}>
        <Eyebrow tone="accent">PILOT COHORT</Eyebrow>
        <SectionTitle id="pilot-h">Running with a small cohort first.</SectionTitle>
        <p className={styles.lead}>
          We&apos;re onboarding a few buyers, lenders and apps whose borrowers want higher limits,
          before anything opens to the public. Here&apos;s what pilot partners get.
        </p>
        <ul className={styles.perks}>
          {PERKS.map((perk) => (
            <li key={perk.title} className={styles.perk}>
              <span className={styles.perkTitle}>
                <span aria-hidden="true" className={styles.perkHex}>
                  ⬡
                </span>
                {perk.title}
              </span>
              <span className={styles.perkText}>{perk.text}</span>
            </li>
          ))}
          <li className={styles.perk}>
            <span className={cx(styles.perkTitle, styles.perkTitleMuted)}>Not sure you fit?</span>
            <Link href={routes.contact} className={styles.textLink}>
              Talk to us →
            </Link>
          </li>
        </ul>
        <div className={styles.actions}>
          <ButtonLink href={routes.contact}>Talk to us</ButtonLink>
          <ButtonLink href={site.docsUrl} variant="secondary">
            Read the docs
          </ButtonLink>
        </div>
      </div>

      <div className={styles.art}>
        <Image
          src={honeycombDark}
          alt={ART_ALT}
          sizes={ART_SIZES}
          className={cx(styles.artImage, "dark-only", "float")}
        />
        <Image
          src={honeycombLight}
          alt={ART_ALT}
          sizes={ART_SIZES}
          className={cx(styles.artImage, "light-only", "float")}
        />
      </div>
    </Section>
  );
}
