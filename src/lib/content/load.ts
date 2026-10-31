import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { parse as parseYaml } from "yaml";

import { renderMarkdown } from "./markdown";
import type { ContentPage, Frontmatter, PageType } from "./types";

/*
 * Site content lives in /content as Markdown with YAML front matter, read
 * synchronously at build time so every page stays fully prerendered.
 *
 *   content/pages/home.md         → /
 *   content/pages/<name>.md       → /<name>
 *   content/learn/index.md        → /learn
 *   content/learn/<slug>.md       → /learn/<slug>
 *   content/research/...          → /research/...
 *
 * Drafts (status: draft) are only visible when CONTENT_PREVIEW=1, so a
 * production build ships published pages only.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const SECTIONS = ["pages", "learn", "research"] as const;
const PAGE_TYPES: PageType[] = [
  "home",
  "contact",
  "article",
  "collection",
  "faq",
  "glossary",
  "about",
  "webpage",
];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function routeFor(section: (typeof SECTIONS)[number], file: string): string {
  const name = file.replace(/\.md$/, "");
  if (section === "pages") return name === "home" ? "/" : `/${name}`;
  return name === "index" ? `/${section}` : `/${section}/${name}`;
}

function parseFile(section: (typeof SECTIONS)[number], file: string): ContentPage {
  const relative = path.join("content", section, file);
  const source = readFileSync(path.join(CONTENT_DIR, section, file), "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`${relative}: missing front matter`);

  const data = parseYaml(match[1]) as Partial<Frontmatter>;
  const problems: string[] = [];
  if (!data.title) problems.push("title");
  if (!data.description) problems.push("description");
  if (!data.type || !PAGE_TYPES.includes(data.type)) problems.push("type");
  if (data.status !== "draft" && data.status !== "published") problems.push("status");
  if (!data.updated || !ISO_DATE.test(String(data.updated))) problems.push("updated (YYYY-MM-DD)");
  if (data.published != null && !ISO_DATE.test(String(data.published))) problems.push("published (YYYY-MM-DD)");
  if (data.status === "published" && !data.published && data.type !== "home" && data.type !== "contact") {
    problems.push("published (required once status is published)");
  }
  if (problems.length > 0) throw new Error(`${relative}: invalid or missing ${problems.join(", ")}`);

  const rendered = renderMarkdown(match[2]);
  if (rendered.hasH1) throw new Error(`${relative}: the body must not contain an H1 (the title is the H1)`);

  return {
    ...(data as Frontmatter),
    updated: String(data.updated),
    published: data.published ? String(data.published) : undefined,
    path: routeFor(section, file),
    file: relative,
    markdown: rendered.markdown,
    html: rendered.html,
    sections: rendered.sections,
    text: rendered.text,
    wordCount: rendered.wordCount,
    internalLinks: rendered.internalLinks,
    reviewNotes: rendered.reviewNotes,
  };
}

let cache: ContentPage[] | null = null;

/** Every page in /content, drafts included, home first and then by path. */
export function allPages(): ContentPage[] {
  if (!cache) {
    cache = SECTIONS.flatMap((section) =>
      readdirSync(path.join(CONTENT_DIR, section))
        .filter((file) => file.endsWith(".md"))
        .map((file) => parseFile(section, file)),
    ).sort((a, b) => (a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path)));
  }
  return cache;
}

export function previewEnabled(): boolean {
  return process.env.CONTENT_PREVIEW === "1";
}

export function isVisible(page: ContentPage): boolean {
  return page.status === "published" || previewEnabled();
}

/** Pages that exist on this build: published ones, plus drafts in preview. */
export function visiblePages(): ContentPage[] {
  return allPages().filter(isVisible);
}

export function findPage(pathname: string): ContentPage | undefined {
  return allPages().find((page) => page.path === pathname);
}

/** A page that must exist in /content (throws otherwise). */
export function getPage(pathname: string): ContentPage {
  const page = findPage(pathname);
  if (!page) throw new Error(`No content file for ${pathname}`);
  return page;
}

/** The page if it is visible on this build, for gating links. */
export function visiblePage(pathname: string): ContentPage | undefined {
  const page = findPage(pathname);
  return page && isVisible(page) ? page : undefined;
}
