import Link from "next/link";

import { breadcrumbTrail } from "@/lib/seo/jsonld";

import styles from "./Content.module.css";

/** Visible trail matching the page's BreadcrumbList markup. */
export function Breadcrumbs({ pathname }: { pathname: string }) {
  const trail = breadcrumbTrail(pathname);
  if (trail.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
      <ol>
        {trail.map((crumb, index) =>
          index < trail.length - 1 ? (
            <li key={crumb.path}>
              <Link href={crumb.path}>{crumb.name}</Link>
            </li>
          ) : (
            <li key={crumb.path} aria-current="page">
              {crumb.name}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
