import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/JsonLd";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Typography";
import { allPages, getPage, isVisible, visiblePage } from "@/lib/content/load";
import type { ContentPage } from "@/lib/content/types";
import { graphFor } from "@/lib/seo/jsonld";
import { metadataFor } from "@/lib/seo/metadata";
import { routes, site } from "@/lib/site";

import { Breadcrumbs } from "./Breadcrumbs";
import styles from "./Content.module.css";

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

/** Metadata for a content route (call from the route's `metadata` export). */
export function contentMetadata(pathname: string) {
  return metadataFor(pathname);
}

function childPages(pathname: string): ContentPage[] {
  const prefix = `${pathname}/`;
  return allPages().filter((page) => page.path.startsWith(prefix) && isVisible(page));
}

/**
 * Server-rendered page for a Markdown file in /content. Every word is in the
 * HTML; nothing depends on client state. Drafts 404 unless CONTENT_PREVIEW=1.
 */
export function ContentRoute({ path }: { path: string }) {
  const page = getPage(path);
  if (!isVisible(page)) notFound();

  const about = visiblePage("/about");
  const related = (page.related ?? [])
    .map((relatedPath) => visiblePage(relatedPath))
    .filter((p): p is ContentPage => Boolean(p));
  const children = page.type === "collection" ? childPages(path) : [];
  const Wrapper = page.type === "article" ? "article" : "div";
  const showDates = page.type !== "collection";

  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main className={styles.main}>
        <Wrapper className={styles.page}>
          {page.status === "draft" && (
            <p className={styles.draftBanner}>Draft preview: not published</p>
          )}
          <Breadcrumbs pathname={path} />

          <header className={styles.header}>
            {page.eyebrow && <Eyebrow tone="accent">{page.eyebrow}</Eyebrow>}
            <h1 className={styles.title}>{page.title}</h1>
            {showDates && (
              <p className={styles.meta}>
                {page.type === "article" && (
                  <>
                    By {about ? <Link href={about.path}>{site.founderName}</Link> : site.founderName}
                    {" · "}
                  </>
                )}
                {page.published && page.published !== page.updated && (
                  <>
                    Published <time dateTime={page.published}>{formatDate(page.published)}</time>
                    {" · "}
                  </>
                )}
                Updated <time dateTime={page.updated}>{formatDate(page.updated)}</time>
              </p>
            )}
          </header>

          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: page.html }} />

          {children.length > 0 && (
            <ul className={styles.cards}>
              {children.map((child) => (
                <li key={child.path} className={styles.card}>
                  <h2 className={styles.cardTitle}>
                    <Link href={child.path}>{child.title}</Link>
                  </h2>
                  <p className={styles.cardText}>{child.description}</p>
                </li>
              ))}
            </ul>
          )}

          {related.length > 0 && (
            <aside aria-labelledby="related-h" className={styles.related}>
              <h2 id="related-h" className={styles.relatedTitle}>
                Related
              </h2>
              <ul>
                {related.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <aside aria-labelledby="cta-h" className={styles.cta}>
            <h2 id="cta-h" className={styles.ctaTitle}>
              Join the pilot cohort
            </h2>
            <p className={styles.ctaText}>
              Nectar is in development. A small pilot cohort of curators, lending protocols and
              buyers comes first.
            </p>
            <ButtonLink href={routes.contact} size="md">
              Talk to us
            </ButtonLink>
          </aside>
        </Wrapper>
      </main>
      <SiteFooter />
      <JsonLd data={graphFor(path)} />
    </>
  );
}
