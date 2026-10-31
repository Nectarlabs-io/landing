/**
 * Whether this build may be indexed. Set SITE_NOINDEX=true on staging (it is
 * read at build time): robots.txt then disallows everything and every page
 * gets a noindex robots tag. Production leaves it unset.
 */
export function siteIsIndexable(): boolean {
  return process.env.SITE_NOINDEX !== "true";
}
