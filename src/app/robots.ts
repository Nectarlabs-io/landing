import type { MetadataRoute } from "next";

import { siteIsIndexable } from "@/lib/seo/indexing";
import { absoluteUrl } from "@/lib/seo/urls";

/*
 * A crawler obeys only the most specific group that names it, so every group
 * repeats the /api/ rule rather than inheriting it from "*".
 */
const PUBLIC = { allow: "/", disallow: "/api/" };

/** Search and answer engines: they index pages and cite them in answers. */
const SEARCH_AND_ANSWER_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
];

/*
 * Training crawlers are allowed on purpose: being in future model knowledge
 * helps assistants mention Nectar Network unprompted. This is a deliberate
 * choice, not a default. To opt out of training while staying in search and
 * answer engines, change these groups to `disallow: "/"`.
 * (Google-Extended also covers grounding in Gemini; it does not affect Search.)
 */
const TRAINING_CRAWLERS = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  if (!siteIsIndexable()) {
    // Staging and other non-production builds stay out of every index.
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: SEARCH_AND_ANSWER_CRAWLERS, ...PUBLIC },
      { userAgent: TRAINING_CRAWLERS, ...PUBLIC },
      { userAgent: "*", ...PUBLIC },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
