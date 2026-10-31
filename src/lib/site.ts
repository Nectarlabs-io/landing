export const site = {
  name: "Nectar Network",
  alternateName: "Nectar",
  /** Canonical origin. Every canonical URL, sitemap entry and OG URL uses it. */
  url: "https://nectarnetwork.fun",
  /**
   * The one-line definition (Oct 31 positioning), used verbatim in the
   * Organization description, llms.txt, /about and the FAQ.
   */
  definition:
    "Nectar Network is credit and liquidity for tokenized assets: lending markets whose borrowing limits are backed by committed buyers, so loans can go further and positions still close when DEX liquidity can't absorb them.",
  tagline: "Credit and liquidity for tokenized assets.",

  contactEmail: "kunal@nectarnetwork.fun",
  founderName: "Kunal",
  founderRole: "Founder",
  /** Profiles shown on /about (and in its Person markup). */
  founderLinks: [
    "https://x.com/kunaldrall_",
    "https://github.com/kunal-drall",
    "https://linkedin.com/in/kunaldrall",
  ],

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
