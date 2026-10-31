import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { allPages } from "@/lib/content/load";
import type { ContentPage } from "@/lib/content/types";
import { fullTitle } from "@/lib/seo/metadata";

/*
 * Editorial rules for every page in /content, drafts included, so a draft is
 * publishable as soon as its REVIEW notes are resolved.
 */

const pages = allPages();
const published = pages.filter((p) => p.status === "published");

const CHAIN_NAMES =
  /\b(stellar|soroban|arc|base|sui|starknet|ethereum|monad|plasma|robinhood chain|evm|xlm)\b/i;
const BANNED_PHRASES = /exit liquidity|guaranteed|testnet|stock/i;
// Internal codenames: only Pappus and Macaulay are public protocol names.
const CODENAMES = /cram[eé]r|avellaneda/i;
// Lines from before the Oct 31 repositioning.
const OLD_LINES =
  /Exit infrastructure for global credit|Curators pay for capacity|Two protocols underneath|house buyer vault|exit infrastructure for lending markets/i;
// "[N]", "[CONTACT EMAIL]" and the like; markdown links such as [X](...) are fine.
const PLACEHOLDER = /\[[A-Z][A-Z0-9 _-]*\](?!\()/;

/** A link to a file in /public (it has an extension), rather than to a page. */
const isFile = (link: string) => /\.[a-z0-9]+$/i.test(link);

function everyText(page: ContentPage): string {
  return [page.title, page.metaTitle, page.description, page.markdown].filter(Boolean).join("\n");
}

describe("content front matter", () => {
  it.each(pages.map((p) => [p.path, p]))("%s has a title of about 50–60 characters", (_, page) => {
    const length = fullTitle(page.path).length;
    expect(length, fullTitle(page.path)).toBeGreaterThanOrEqual(48);
    expect(length, fullTitle(page.path)).toBeLessThanOrEqual(62);
  });

  it.each(pages.map((p) => [p.path, p]))("%s has a description of about 140–160 characters", (_, page) => {
    expect(page.description.length, page.description).toBeGreaterThanOrEqual(135);
    expect(page.description.length, page.description).toBeLessThanOrEqual(165);
  });

  it("titles and descriptions are unique", () => {
    const titles = pages.map((p) => fullTitle(p.path));
    const descriptions = pages.map((p) => p.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("updated is never before published", () => {
    for (const page of pages) {
      if (page.published) expect(page.updated >= page.published, page.path).toBe(true);
    }
  });
});

describe("content wording", () => {
  it.each(pages.map((p) => [p.path, p]))("%s names no chains and avoids banned phrases", (_, page) => {
    const text = everyText(page);
    expect(text.match(CHAIN_NAMES)?.[0] ?? null).toBeNull();
    expect(text.match(BANNED_PHRASES)?.[0] ?? null).toBeNull();
    expect(text.match(CODENAMES)?.[0] ?? null).toBeNull();
    expect(text.match(OLD_LINES)?.[0] ?? null).toBeNull();
  });

  it.each(pages.map((p) => [p.path, p]))("%s makes no live-product claim", (_, page) => {
    // The only allowed "live" is the FAQ question that answers "No".
    const hits = everyText(page)
      .split("\n")
      .filter((line) => /\blive\b/i.test(line) && line.trim() !== "## Is it live?");
    expect(hits).toEqual([]);
  });

  it.each(pages.map((p) => [p.path, p]))("%s has no bracket placeholders", (_, page) => {
    expect(everyText(page).match(PLACEHOLDER)?.[0] ?? null).toBeNull();
  });
});

describe("content structure", () => {
  it("published pages have no open REVIEW notes", () => {
    for (const page of published) expect(page.reviewNotes, page.path).toEqual([]);
  });

  it("internal links point at pages, routes or files that exist", () => {
    const known = new Set([...pages.map((p) => p.path), "/contact"]);
    for (const page of pages) {
      for (const link of page.internalLinks) {
        const ok = isFile(link) ? existsSync(path.join("public", link)) : known.has(link);
        expect(ok, `${page.path} → ${link}`).toBe(true);
      }
    }
  });

  it("published pages link only to published pages", () => {
    const shipped = new Set([...published.map((p) => p.path), "/contact"]);
    for (const page of published) {
      for (const link of page.internalLinks) {
        if (!isFile(link)) expect(shipped.has(link), `${page.path} → ${link}`).toBe(true);
      }
    }
  });

  it("a published page's section hub is published too", () => {
    for (const page of published) {
      const hub = page.path.match(/^\/(learn|research)\/.+/)?.[1];
      if (hub) expect(published.some((p) => p.path === `/${hub}`), page.path).toBe(true);
    }
  });

  it("learn articles run 800–1,500 words", () => {
    for (const page of pages.filter((p) => p.path.startsWith("/learn/") && p.type === "article")) {
      expect(page.wordCount, page.path).toBeGreaterThanOrEqual(800);
      expect(page.wordCount, page.path).toBeLessThanOrEqual(1500);
    }
  });

  it("FAQ answers are 2–4 sentences", () => {
    const faq = pages.find((p) => p.type === "faq");
    expect(faq).toBeDefined();
    for (const section of faq!.sections) {
      // Count sentence ends, ignoring "e.g." style abbreviations.
      const sentences = section.text.replace(/\be\.g\./g, "eg").match(/[.!?](\s|$)/g)?.length ?? 0;
      expect(sentences, section.heading).toBeGreaterThanOrEqual(2);
      expect(sentences, section.heading).toBeLessThanOrEqual(4);
    }
  });

  it("the glossary defines every requested term", () => {
    const glossary = pages.find((p) => p.type === "glossary");
    const terms = glossary!.sections.map((s) => s.heading.toLowerCase());
    for (const term of [
      "borrowing limit",
      "recoverable value",
      "haircut",
      "notice period",
      "commitment fee",
      "rate premium",
      "prop amm",
      "lltv",
      "liquidation bonus",
      "supply cap",
      "curator",
      "keeper",
      "funded quote",
      "escrow",
      "exit gap",
      "committed capacity",
      "redemption queue",
    ]) {
      expect(terms).toContain(term);
    }
  });
});
