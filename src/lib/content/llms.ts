import { allPages, getPage } from "@/lib/content/load";
import type { ContentPage } from "@/lib/content/types";
import { absoluteUrl } from "@/lib/seo/urls";
import { site } from "@/lib/site";

/*
 * /llms.txt and /llms-full.txt (llmstxt.org format): an H1, a blockquote
 * summary, then H2 sections of links. Published pages only, like the sitemap.
 */

function published(): ContentPage[] {
  return allPages().filter((page) => page.status === "published");
}

function section(pages: ContentPage[], prefix: string | null): ContentPage[] {
  return pages.filter((page) =>
    prefix ? page.path === prefix || page.path.startsWith(`${prefix}/`) : !/^\/(learn|research)(\/|$)/.test(page.path),
  );
}

function linkLine(page: ContentPage): string {
  const name = page.path === "/" ? "Home" : (page.metaTitle ?? page.title);
  return `- [${name}](${absoluteUrl(page.path)}): ${page.description}`;
}

function header(): string[] {
  return [
    `# ${site.name}`,
    "",
    `> ${site.definition}`,
    "",
    `${site.name} is in development: nothing is available to use yet, and a small pilot cohort of buyers, lenders and apps comes first. Contact: ${site.contactEmail}.`,
    "",
  ];
}

export function llmsTxt(): string {
  const pages = published();
  const groups: Array<[string, ContentPage[]]> = [
    ["Pages", section(pages, null)],
    ["Learn", section(pages, "/learn")],
    ["Research", section(pages, "/research")],
  ];

  const lines = header();
  for (const [title, group] of groups) {
    if (group.length === 0) continue;
    lines.push(`## ${title}`, "", ...group.map(linkLine), "");
  }
  lines.push(
    "## Optional",
    "",
    `- [Docs](${site.docsUrl}): Technical documentation`,
    `- [GitHub](${site.githubUrl}): Contracts and keeper daemon, MIT licence`,
    `- [X](${site.xUrl}): Updates`,
    `- [Full text](${absoluteUrl("/llms-full.txt")}): Every page above in one Markdown file`,
    "",
  );
  return lines.join("\n");
}

/** Relative links ("/learn/...") made absolute, so the text stands alone. */
function absoluteLinks(markdown: string): string {
  return markdown.replace(/\]\(\//g, `](${site.url}/`);
}

export function llmsFullTxt(): string {
  const lines = header();
  const home = getPage("/");
  lines.push(`Home: ${absoluteUrl("/")} (${home.description})`, "");

  for (const page of published().filter((p) => p.markdown.trim().length > 0)) {
    lines.push(
      "---",
      "",
      `# ${page.title}`,
      "",
      `URL: ${absoluteUrl(page.path)}`,
      `Updated: ${page.updated}`,
      "",
      absoluteLinks(page.markdown),
      "",
    );
  }
  return lines.join("\n");
}
