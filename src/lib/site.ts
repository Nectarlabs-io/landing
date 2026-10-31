export const site = {
  name: "Nectar Network",
  url: "https://nectarnetwork.fun",
  tagline: "Exit infrastructure for global credit.",
  description:
    "Nectar lines up funded buyers for lending-market collateral, so positions close even when DEX liquidity can't absorb them. Curators raise caps. Lenders get repaid.",

  docsUrl: "https://docs.nectar.monster",
  githubUrl: "https://github.com/Nectar-Network/nectar",
  xUrl: "https://x.com/nectar_xlm",
  mediaKitUrl: "https://nectarnetwork.fun/media-kit",

  // Placeholders carried over from the design. Fill these in before launch.
  contactEmail: "[CONTACT EMAIL]",
  replyWindow: "[N] business days",
} as const;

export const routes = {
  home: "/",
  contact: "/contact",
  feed: "/app/feed",
  quotes: "/app/quotes",
  curate: "/app/curate",
  keepers: "/app/keepers",
} as const;
