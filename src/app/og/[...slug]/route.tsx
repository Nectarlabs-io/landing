import { readFileSync } from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import { findPage, isVisible, visiblePages } from "@/lib/content/load";
import type { ContentPage } from "@/lib/content/types";
import { OG_SIZE, ogImagePath, pathFromOgSlug } from "@/lib/seo/urls";

/*
 * 1200×630 Open Graph image for every page, generated at build time:
 * /og/home, /og/contact, /og/learn/<slug>, ...
 */

function font(file: string): ArrayBuffer {
  const buffer = readFileSync(path.join(process.cwd(), "src/assets/fonts", file));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

const FONTS = [
  { name: "Syne", data: font("Syne-Bold.ttf"), weight: 700 as const, style: "normal" as const },
  { name: "DM Mono", data: font("DMMono-Regular.ttf"), weight: 400 as const, style: "normal" as const },
];

const COLORS = {
  bg: "#0d0f12",
  border: "#23272f",
  cell: "#343a46",
  accent: "#16f3a9",
  heading: "#e6e9ef",
  dim: "#8f96a3",
};

export function generateStaticParams() {
  return visiblePages().map((page) => ({ slug: ogImagePath(page.path).split("/").slice(2) }));
}

function label(page: ContentPage): string {
  if (page.eyebrow) return page.eyebrow;
  if (page.path.startsWith("/learn")) return "LEARN";
  if (page.path.startsWith("/research")) return "RESEARCH";
  return "NECTAR NETWORK";
}

/** The honeycomb mark with the mint centre cell and droplet. */
function Mark({ size }: { size: number }) {
  const cells = [
    "36.82,16.6 43.23,20.3 43.23,27.7 36.82,31.4 30.41,27.7 30.41,20.3",
    "11.18,16.6 17.59,20.3 17.59,27.7 11.18,31.4 4.77,27.7 4.77,20.3",
    "30.41,27.7 36.82,31.4 36.82,38.8 30.41,42.5 24,38.8 24,31.4",
    "30.41,5.5 36.82,9.2 36.82,16.6 30.41,20.3 24,16.6 24,9.2",
    "17.59,27.7 24,31.4 24,38.8 17.59,42.5 11.18,38.8 11.18,31.4",
    "17.59,5.5 24,9.2 24,16.6 17.59,20.3 11.18,16.6 11.18,9.2",
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {cells.map((points) => (
        <polygon key={points} points={points} stroke={COLORS.cell} strokeWidth="1.5" strokeLinejoin="round" />
      ))}
      <polygon
        points="24,16.6 30.41,20.3 30.41,27.7 24,31.4 17.59,27.7 17.59,20.3"
        stroke={COLORS.accent}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="rgba(0,229,160,0.10)"
      />
      <path
        d="M20.9 26.84 a3.1 3.1 0 1 0 6.2 0 C27.1 24.36 25.24 21.88 24 20.02 C22.76 21.88 20.9 24.36 20.9 26.84 Z"
        fill={COLORS.accent}
      />
    </svg>
  );
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[...slug]">) {
  const { slug } = await params;
  const page = findPage(pathFromOgSlug(slug));
  if (!page || !isVisible(page)) return new Response("Not found", { status: 404 });

  const title = page.title;
  const titleSize = title.length > 70 ? 54 : title.length > 44 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          fontFamily: "DM Mono",
          color: COLORS.dim,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Mark size={64} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Syne", fontSize: 30, letterSpacing: 6, color: "#b4bccc" }}>
              NECTAR
            </span>
            <span style={{ fontSize: 14, letterSpacing: 9, color: COLORS.dim }}>NETWORK</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontSize: 22, letterSpacing: 4, color: COLORS.accent }}>{label(page)}</span>
          <span
            style={{
              fontFamily: "Syne",
              fontSize: titleSize,
              lineHeight: 1.05,
              letterSpacing: -1,
              color: COLORS.heading,
              maxWidth: 1000,
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}>
          <span>nectarnetwork.fun</span>
          <span>Exit infrastructure for lending markets</span>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: FONTS },
  );
}
