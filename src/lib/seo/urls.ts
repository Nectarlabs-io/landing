import { site } from "@/lib/site";

/**
 * Absolute URL on the canonical origin. The root is written without a
 * trailing slash, matching the canonical tag Next.js emits for "/".
 */
export function absoluteUrl(pathname: string): string {
  return pathname === "/" ? site.url : `${site.url}${pathname}`;
}

/** Path of the generated 1200×630 Open Graph image for a page. */
export function ogImagePath(pathname: string): string {
  return pathname === "/" ? "/og/home" : `/og${pathname}`;
}

/** Page path for an OG route slug (inverse of ogImagePath). */
export function pathFromOgSlug(slug: string[]): string {
  return slug.length === 1 && slug[0] === "home" ? "/" : `/${slug.join("/")}`;
}

export const OG_SIZE = { width: 1200, height: 630 } as const;
