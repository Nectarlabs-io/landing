import { llmsFullTxt } from "@/lib/content/llms";

/** Every published page's text in one Markdown file. Prerendered at build. */
export function GET() {
  return new Response(llmsFullTxt(), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
