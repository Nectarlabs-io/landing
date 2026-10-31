import type { Graph } from "schema-dts";

/**
 * Structured data as a native script tag, server-rendered into the HTML.
 * "<" is escaped so content can never close the script element.
 */
export function JsonLd({ data }: { data: Graph }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
