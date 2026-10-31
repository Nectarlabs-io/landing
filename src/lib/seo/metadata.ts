import type { Metadata } from "next";

import { getPage, visiblePage } from "@/lib/content/load";
import { site } from "@/lib/site";

import { absoluteUrl, OG_SIZE, ogImagePath } from "./urls";

export const TITLE_SUFFIX = " | Nectar Network";

/** The full <title> for a page (also used on its social cards). */
export function fullTitle(pathname: string): string {
  const page = getPage(pathname);
  return page.absoluteTitle ?? `${page.metaTitle ?? page.title}${TITLE_SUFFIX}`;
}

/**
 * Metadata for a page from its front matter: unique title and description,
 * a self-referencing canonical, Open Graph and Twitter cards with the page's
 * generated image. Drafts (visible only in preview builds) are noindex.
 */
export function metadataFor(pathname: string): Metadata {
  const page = getPage(pathname);
  const title = fullTitle(pathname);
  const image = { url: ogImagePath(pathname), ...OG_SIZE, alt: page.title };
  const isArticle = page.type === "article";
  const about = visiblePage("/about");

  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: pathname },
    openGraph: {
      type: isArticle ? "article" : "website",
      url: pathname,
      siteName: site.name,
      locale: "en_US",
      title,
      description: page.description,
      images: [image],
      ...(isArticle
        ? {
            publishedTime: page.published,
            modifiedTime: page.updated,
            authors: [about ? absoluteUrl(about.path) : site.founderName],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: site.xHandle,
      title,
      description: page.description,
      images: [image.url],
    },
    ...(page.status === "draft" ? { robots: { index: false, follow: false } } : {}),
  };
}
