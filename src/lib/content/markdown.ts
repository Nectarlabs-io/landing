import type { Element, ElementContent, Root, RootContent } from "hast";
import { toHtml } from "hast-util-to-html";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import type { Section } from "./types";

/*
 * Markdown → HTML at build time (remark → rehype). Raw HTML in Markdown is
 * dropped (remark-rehype's default), so <!-- REVIEW --> comments never render.
 */

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(() => tidyTables);

/** Give header cells scope="col" and wrap tables so they scroll on phones. */
function tidyTables(tree: Root) {
  const visit = (parent: Root | Element) => {
    parent.children = parent.children.map((child) => {
      if (child.type !== "element") return child;
      if (child.tagName === "th") child.properties = { ...child.properties, scope: "col" };
      visit(child);
      if (child.tagName === "table") {
        return {
          type: "element",
          tagName: "div",
          properties: { className: ["table-scroll"] },
          children: [child],
        } satisfies Element;
      }
      return child;
    }) as typeof parent.children;
  };
  visit(tree);
}

function textOf(node: Root | RootContent | ElementContent): string {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map((child) => textOf(child as RootContent)).join("");
  return "";
}

const BLOCK_TAGS = new Set(["p", "li", "h2", "h3", "h4", "tr", "th", "td", "blockquote"]);

/** Plain text with block boundaries kept as spaces, whitespace collapsed. */
function plainText(nodes: RootContent[]): string {
  const parts: string[] = [];
  const walk = (node: RootContent | ElementContent) => {
    if (node.type === "text") parts.push(node.value);
    else if (node.type === "element") {
      node.children.forEach(walk);
      if (BLOCK_TAGS.has(node.tagName)) parts.push(" ");
    }
  };
  nodes.forEach(walk);
  return parts.join("").replace(/\s+/g, " ").trim();
}

function collectLinks(nodes: RootContent[]): string[] {
  const links = new Set<string>();
  const walk = (node: RootContent | ElementContent) => {
    if (node.type !== "element") return;
    const href = node.properties?.href;
    if (node.tagName === "a" && typeof href === "string" && href.startsWith("/")) {
      links.add(href.split("#")[0] || "/");
    }
    node.children.forEach(walk);
  };
  nodes.forEach(walk);
  return [...links];
}

const REVIEW_COMMENT = /<!--\s*REVIEW:([\s\S]*?)-->/g;

export function renderMarkdown(source: string) {
  const reviewNotes = [...source.matchAll(REVIEW_COMMENT)].map((m) => m[1].trim());
  const markdown = source.replace(REVIEW_COMMENT, "").replace(/\n{3,}/g, "\n\n").trim();

  const tree = processor.runSync(processor.parse(markdown)) as Root;
  const children = tree.children;

  const sections: Section[] = [];
  let current: { heading: Element; nodes: RootContent[] } | null = null;
  const flush = () => {
    if (!current) return;
    const root: Root = { type: "root", children: current.nodes };
    sections.push({
      heading: textOf(current.heading).trim(),
      id: String(current.heading.properties?.id ?? ""),
      html: toHtml(root),
      text: plainText(current.nodes),
    });
  };
  for (const node of children) {
    if (node.type === "element" && node.tagName === "h2") {
      flush();
      current = { heading: node, nodes: [] };
    } else if (current) {
      current.nodes.push(node);
    }
  }
  flush();

  const text = plainText(children);
  return {
    markdown,
    html: toHtml(tree),
    sections,
    text,
    wordCount: text ? text.split(/\s+/).length : 0,
    internalLinks: collectLinks(children),
    reviewNotes,
    hasH1: children.some((n) => n.type === "element" && n.tagName === "h1"),
  };
}
