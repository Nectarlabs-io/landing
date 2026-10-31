export const site = {
  name: "Nectar Network",
  url: "https://nectarnetwork.fun",
  tagline: "Exit infrastructure for global credit.",
  description:
    "Nectar lines up funded buyers for lending-market collateral, so positions close even when DEX liquidity can't absorb them. Curators raise caps. Lenders get repaid.",

  contactEmail: "kunal@nectarnetwork.fun",

  docsUrl: "https://docs.nectar.monster",
  githubUrl: "https://github.com/Nectar-Network/nectar",
  // Served by the current site; must be ported here before the domain switch.
  mediaKitUrl: "https://nectarnetwork.fun/media-kit",
} as const;

export const routes = {
  home: "/",
  contact: "/contact",
} as const;
