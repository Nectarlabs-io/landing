"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import iconStyles from "@/components/ui/IconButton.module.css";
import { MenuIcon } from "@/components/ui/Icons";
import { SmartLink } from "@/components/ui/SmartLink";
import { cx } from "@/lib/cx";
import { routes, site } from "@/lib/site";

import styles from "./SiteHeader.module.css";

const NAV_LINKS = [
  { label: "Pilot", href: "/#pilot" },
  { label: "How it works", href: "/#how" },
  { label: "Products", href: "/#products" },
  { label: "Security", href: "/#security" },
  { label: "Docs", href: site.docsUrl },
];

/**
 * Marketing-site header. Below 760px the links collapse behind a menu button.
 * `showCta` adds the "Talk to us" button (and moves the theme toggle into the
 * mobile menu); the contact page itself leaves it off.
 */
export function SiteHeader({ showCta = true }: { showCta?: boolean }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const close = () => setOpen(false);

  return (
    <header
      className={styles.header}
      data-menu={open ? "open" : "closed"}
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <nav aria-label="Main" className={styles.nav}>
        <Link
          href={routes.home}
          className={styles.brand}
          aria-label="Nectar Network home"
          onClick={close}
        >
          <LogoMark size={36} />
          <Wordmark size="lg" />
        </Link>

        <div id={menuId} className={styles.links}>
          {NAV_LINKS.map((link) => (
            <SmartLink key={link.label} href={link.href} className={styles.link} onClick={close}>
              {link.label}
            </SmartLink>
          ))}
          {showCta && (
            <>
              <Link
                href={routes.contact}
                className={cx(styles.link, styles.menuOnly, styles.menuCta)}
                onClick={close}
              >
                Talk to us →
              </Link>
              <ThemeToggle variant="row" className={cx(styles.menuOnly, styles.themeRow)} />
            </>
          )}
        </div>

        <div className={styles.actions}>
          <ThemeToggle className={showCta ? styles.hideSm : undefined} />
          {showCta && (
            <ButtonLink href={routes.contact} size="md" className={styles.hideXs}>
              Talk to us
            </ButtonLink>
          )}
          <button
            type="button"
            className={cx(iconStyles.iconButton, styles.menuButton)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label="Menu"
            onClick={() => setOpen((value) => !value)}
          >
            <MenuIcon />
          </button>
        </div>
      </nav>
    </header>
  );
}
