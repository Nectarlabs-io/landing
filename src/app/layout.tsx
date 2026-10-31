import type { Metadata } from "next";
import { DM_Mono, Syne } from "next/font/google";

import { DEFAULT_THEME, themeInitScript } from "@/components/theme/theme-store";
import { siteIsIndexable } from "@/lib/seo/indexing";
import { site } from "@/lib/site";

import "./globals.css";

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

// Search engine verification codes, read at build time (see README).
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.BING_SITE_VERIFICATION?.trim();

/*
 * Site-wide defaults. Every page sets its own title, description, canonical
 * and social cards from its front matter (src/lib/seo/metadata.ts).
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.definition,
  applicationName: site.name,
  robots: siteIsIndexable()
    ? {
        index: true,
        follow: true,
        // Let search and AI features quote and preview as much as they need.
        googleBot: {
          index: true,
          follow: true,
          "max-snippet": -1,
          "max-image-preview": "large",
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
  },
  openGraph: { type: "website", siteName: site.name, locale: "en_US" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={`${dmMono.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
