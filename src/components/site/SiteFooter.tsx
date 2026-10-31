import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { SmartLink } from "@/components/ui/SmartLink";
import { visiblePage } from "@/lib/content/load";
import { routes, site } from "@/lib/site";

import styles from "./SiteFooter.module.css";

const COPYRIGHT = "© 2026 Nectar Network · MIT License";

type FooterLink = { label: string; href: string };

/** A link to a content page, only if that page is published on this build. */
function pageLink(label: string, pathname: string): FooterLink[] {
  return visiblePage(pathname) ? [{ label, href: pathname }] : [];
}

function mediaKitHref(): string {
  return visiblePage("/media-kit") ? "/media-kit" : site.mediaKitUrl;
}

function footerColumns(): Array<{ title: string; links: FooterLink[] }> {
  const columns = [
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
        { label: "How it works", href: visiblePage("/how-it-works") ? "/how-it-works" : "/#how" },
        { label: "Security", href: "/#security" },
      ],
    },
    {
      title: "Learn",
      links: [
        ...pageLink("Learn", "/learn"),
        ...pageLink("Research", "/research"),
        ...pageLink("Glossary", "/learn/glossary"),
        ...pageLink("FAQ", "/faq"),
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
        ...pageLink("About", "/about"),
        { label: "Pilot cohort", href: "/#pilot" },
        { label: "Talk to us", href: routes.contact },
        { label: site.contactEmail, href: `mailto:${site.contactEmail}` },
        { label: "Media kit", href: mediaKitHref() },
        { label: "X", href: site.xUrl },
        ...pageLink("Privacy", "/privacy"),
      ],
    },
  ];
  return columns.filter((column) => column.links.length > 0);
}

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
          {footerColumns().map((column) => (
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
    { label: "Media kit", href: mediaKitHref() },
    ...pageLink("Privacy", "/privacy"),
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
