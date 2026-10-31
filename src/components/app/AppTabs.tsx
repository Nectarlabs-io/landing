"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cx } from "@/lib/cx";
import { routes } from "@/lib/site";

import styles from "./AppChrome.module.css";

const TABS = [
  { label: "Feed", href: routes.feed },
  { label: "Quotes", href: routes.quotes },
  { label: "Curate", href: routes.curate },
  { label: "Keepers", href: routes.keepers },
];

const SOON = ["Positions", "Reserve"];

export function AppTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="App" className={styles.tabs}>
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={styles.tab}
            aria-current={active ? "page" : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
      {SOON.map((label) => (
        <span key={label} className={cx(styles.tab, styles.tabSoon)} aria-disabled="true">
          {label}
          <span className={styles.soonTag}>soon</span>
        </span>
      ))}
    </nav>
  );
}
