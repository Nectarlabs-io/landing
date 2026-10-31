import { llmsTxt } from "@/lib/content/llms";

/** Markdown map of the site for language models (llmstxt.org). Prerendered at build. */
export function GET() {
  return new Response(llmsTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
