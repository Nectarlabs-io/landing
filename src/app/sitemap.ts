import type { MetadataRoute } from "next";

import { visiblePages } from "@/lib/content/load";
import { siteIsIndexable } from "@/lib/seo/indexing";
import { absoluteUrl } from "@/lib/seo/urls";

/**
 * Every public page, with lastModified taken from its front matter `updated`
 * date. Drafts, /api routes and the OG image routes are never listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteIsIndexable()) return [];
  return visiblePages()
    .filter((page) => page.status === "published")
    .map((page) => ({ url: absoluteUrl(page.path), lastModified: page.updated }));
}
