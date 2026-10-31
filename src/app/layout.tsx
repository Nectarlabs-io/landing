import type { Metadata } from "next";
import { DM_Mono, Syne } from "next/font/google";

import { DEFAULT_THEME, themeInitScript } from "@/components/theme/theme-store";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Nectar — The buyer behind every loan",
    template: "%s — Nectar",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Nectar — The buyer behind every loan",
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary",
    site: "@nectar_xlm",
  },
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
