import Link from "next/link";

import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/lib/site";

import styles from "./AppChrome.module.css";
import { AppTabs } from "./AppTabs";

export function PreviewBar() {
  return (
    <div className={styles.previewBar} role="note">
      <span>
        <b className={styles.previewTag}>PREVIEW</b> · Coming soon to the pilot cohort.
      </span>
      <Link href={routes.contact}>Talk to us →</Link>
    </div>
  );
}

export function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href={routes.home} className={styles.brand} aria-label="Nectar Network home">
          <LogoMark size={30} />
          <Wordmark />
        </Link>
        <AppTabs />
        <div className={styles.actions}>
          <ThemeToggle />
          <ButtonLink href={routes.contact} size="sm">
            Talk to us
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
