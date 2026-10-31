/** What a page is, for metadata, structured data and layout. */
export type PageType =
  | "home" // rendered by app/page.tsx; front matter supplies metadata only
  | "contact" // rendered by app/contact/page.tsx; front matter supplies metadata only
  | "article" // learn and research articles, how-it-works
  | "collection" // hub pages listing other pages (/learn, /research)
  | "faq"
  | "glossary"
  | "about"
  | "webpage"; // plain page (privacy, media kit)

export type PageStatus = "draft" | "published";

export type Frontmatter = {
  /** The page's H1. */
  title: string;
  /** Title for <title> and social cards, before " | Nectar Network". Defaults to `title`. */
  metaTitle?: string;
  /** Full <title> that ignores the suffix (home page only). */
  absoluteTitle?: string;
  /** Meta description: an answer-first summary, about 140–160 characters. */
  description: string;
  type: PageType;
  status: PageStatus;
  /** Small uppercase label above the H1. */
  eyebrow?: string;
  /** Short name for breadcrumbs. Defaults to `title`. */
  crumb?: string;
  /** ISO date (YYYY-MM-DD) first published. Set when the page is approved. */
  published?: string;
  /** ISO date (YYYY-MM-DD) of the last meaningful change. Drives sitemap lastmod. */
  updated: string;
  /** Paths of related pages, shown at the end of the page if they are visible. */
  related?: string[];
};

export type Section = {
  /** H2 text. */
  heading: string;
  /** The H2's id (also the fragment for deep links). */
  id: string;
  /** Section body as HTML (everything until the next H2). */
  html: string;
  /** Section body as plain text, whitespace collapsed. */
  text: string;
};

export type ContentPage = Frontmatter & {
  /** URL path, e.g. "/learn/what-is-exit-capacity". */
  path: string;
  /** Source file relative to the repo root. */
  file: string;
  /** Markdown body, with reviewer comments removed. */
  markdown: string;
  /** Body rendered to HTML. */
  html: string;
  /** Body split at each H2. */
  sections: Section[];
  /** Plain text of the body. */
  text: string;
  wordCount: number;
  /** Internal links ("/..." hrefs) found in the body, without fragments. */
  internalLinks: string[];
  /** Reviewer notes (<!-- REVIEW: ... -->) left in the source. */
  reviewNotes: string[];
};
