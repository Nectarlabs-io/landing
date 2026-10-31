import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { routes, site } from "@/lib/site";

import styles from "./SiteFooter.module.css";

const COPYRIGHT = "© 2026 Nectar Network · MIT License";

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Nectar Feed", href: "/#products" },
      { label: "Nectar Route", href: "/#products" },
      { label: "Nectar Exits", href: "/#products" },
      { label: "Nectar Reserve", href: "/#products" },
      { label: "Nectar Keepers", href: "/#products" },
      { label: "Launch Cover", href: "/#products" },
    ],
  },
  {
    title: "Protocols",
    links: [
      { label: "Pappus", href: "/#protocols" },
      { label: "Macaulay", href: "/#protocols" },
      { label: "How it works", href: "/#how" },
      { label: "Security", href: "/#security" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Docs", href: site.docsUrl },
      { label: "Keeper SDK", href: site.docsUrl },
      { label: "GitHub", href: site.githubUrl },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pilot cohort", href: "/#pilot" },
      { label: "Talk to us", href: routes.contact },
      { label: site.contactEmail, href: `mailto:${site.contactEmail}` },
      { label: "Media kit", href: site.mediaKitUrl },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <LogoMark size={32} />
              <Wordmark />
            </div>
            <p className={styles.tagline}>{site.tagline}</p>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title} className={styles.column}>
              <span className={styles.columnTitle}>{column.title.toUpperCase()}</span>
              {column.links.map((link) => (
                <SmartLink key={link.label} href={link.href} className={styles.columnLink}>
                  {link.label}
                </SmartLink>
              ))}
            </nav>
          ))}
        </div>
        <div className={styles.legal}>
          <span>{COPYRIGHT}</span>
          <span>Nothing on this site is investment advice. Capacity is limited to committed quote size.</span>
        </div>
      </div>
    </footer>
  );
}

export function MiniFooter() {
  const links = [
    { label: "Home", href: routes.home },
    { label: "Docs", href: site.docsUrl },
    { label: "GitHub", href: site.githubUrl },
    { label: "Media kit", href: site.mediaKitUrl },
  ];

  return (
    <footer className={styles.mini}>
      <div className={styles.miniInner}>
        <span>{COPYRIGHT}</span>
        <span className={styles.miniLinks}>
          {links.map((link) => (
            <SmartLink key={link.label} href={link.href} className={styles.miniLink}>
              {link.label}
            </SmartLink>
          ))}
        </span>
      </div>
    </footer>
  );
}
