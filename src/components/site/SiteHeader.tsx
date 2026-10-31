import { visiblePage } from "@/lib/content/load";
import { site } from "@/lib/site";

import { SiteHeaderClient, type NavLink } from "./SiteHeaderClient";

/**
 * Header navigation. Links to content pages appear only once those pages are
 * published (or in a preview build), so production never links to a 404.
 */
export function SiteHeader({ showCta = true }: { showCta?: boolean }) {
  const howItWorks = visiblePage("/how-it-works");

  // Same order as the design's main nav.
  const links: NavLink[] = [
    { label: "Borrowing limits", href: "/#limits" },
    { label: "How it works", href: howItWorks ? howItWorks.path : "/#how" },
    { label: "Pilot", href: "/#pilot" },
    { label: "Products", href: "/#products" },
    { label: "Security", href: "/#security" },
    { label: "Docs", href: site.docsUrl },
  ];

  return <SiteHeaderClient links={links} showCta={showCta} />;
}
