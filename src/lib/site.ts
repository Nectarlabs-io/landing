export const site = {
  name: "Nectar Network",
  alternateName: "Nectar",
  /** Canonical origin. Every canonical URL, sitemap entry and OG URL uses it. */
  url: "https://nectarnetwork.fun",
  /**
   * The one-line definition, used verbatim in metadata and the Organization
   * description. Pending approval before it's used off-site.
   */
  definition:
    "Nectar Network is exit infrastructure for lending markets: it lines up funded buyers for collateral so liquidations can clear when DEX liquidity can't absorb them.",
  tagline: "Exit infrastructure for global credit.",

  contactEmail: "kunal@nectarnetwork.fun",
  founderName: "Kunal",

  docsUrl: "https://docs.nectar.monster",
  githubUrl: "https://github.com/Nectar-Network/nectar",
  githubOrgUrl: "https://github.com/Nectar-Network",
  xUrl: "https://x.com/xNectarNetwork",
  xHandle: "@xNectarNetwork",
  // Served by the current site; replaced by /media-kit once that page is published.
  mediaKitUrl: "https://nectarnetwork.fun/media-kit",

  /** Mono mark on white, 512×512 PNG (Organization logo). */
  logoPath: "/brand/nectar-network-logo.png",
} as const;

export const routes = {
  home: "/",
  contact: "/contact",
} as const;
