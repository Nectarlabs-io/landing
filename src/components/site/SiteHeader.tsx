import { visiblePage } from "@/lib/content/load";
import { site } from "@/lib/site";

import { SiteHeaderClient, type NavLink } from "./SiteHeaderClient";

/**
 * Header navigation. Links to content pages appear only once those pages are
 * published (or in a preview build), so production never links to a 404.
 */
export function SiteHeader({ showCta = true }: { showCta?: boolean }) {
  const howItWorks = visiblePage("/how-it-works");
  const learn = visiblePage("/learn");

  const links: NavLink[] = [
    { label: "Pilot", href: "/#pilot" },
    { label: "How it works", href: howItWorks ? howItWorks.path : "/#how" },
    { label: "Products", href: "/#products" },
    ...(learn ? [{ label: "Learn", href: learn.path }] : []),
    { label: "Security", href: "/#security" },
    { label: "Docs", href: site.docsUrl },
  ];

  return <SiteHeaderClient links={links} showCta={showCta} />;
}
