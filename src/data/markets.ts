/*
 * Snapshot figures shown in the app preview. These are observed values
 * (sources listed on each page), not live data.
 */

export const SNAPSHOT_DATE = "Oct 25, 2026";

/* Nectar Feed ------------------------------------------------------------ */

export type CollateralClass = "btc" | "pt" | "stocks" | "mixed";

export const COLLATERAL_CLASSES: Array<{ id: CollateralClass | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "btc", label: "Wrapped BTC" },
  { id: "pt", label: "Principal tokens" },
  { id: "stocks", label: "Tokenized stocks" },
  { id: "mixed", label: "Mixed pools" },
];

export type FeedMarket = {
  market: string;
  venue: string;
  cls: CollateralClass;
  classLabel: string;
  collateral: string;
  borrowed: string;
  lltv: string;
  depth: string;
  /** Exit gap and the share of collateral DEX depth covers, when depth is measured. */
  exitGap?: { amount: string; depthShare: string };
  status: "observing" | "live" | "watching";
  statusLabel: string;
  asOf: string;
};

export const FEED_MARKETS: FeedMarket[] = [
  {
    market: "cirBTC / USDC",
    venue: "Morpho",
    cls: "btc",
    classLabel: "Wrapped BTC",
    collateral: "$274.0M",
    borrowed: "$178.4M",
    lltv: "86%",
    depth: "≈ $23.9M on Uniswap V3",
    exitGap: { amount: "$250.1M", depthShare: "8.7%" },
    status: "observing",
    statusLabel: "Observing",
    asOf: "Oct 25, 2026",
  },
  {
    market: "PT-reUSD-10DEC2026 / USDC",
    venue: "Morpho",
    cls: "pt",
    classLabel: "Principal token",
    collateral: "$67.5M",
    borrowed: "$52.2M",
    lltv: "91.5%",
    depth: "$8.97M Pendle pool",
    exitGap: { amount: "$58.5M", depthShare: "13.3%" },
    status: "observing",
    statusLabel: "Observing",
    asOf: "Aug 25, 2026",
  },
  {
    market: "PT-AUSD-17DEC2026 / USDC",
    venue: "Aave V3",
    cls: "pt",
    classLabel: "Principal token",
    collateral: "30M PT (cap full)",
    borrowed: "—",
    lltv: "93%",
    depth: "Pendle pool, 47% PT",
    status: "observing",
    statusLabel: "Observing",
    asOf: "Oct 9, 2026",
  },
  {
    market: "Coinbase stock tokens / USDC",
    venue: "Aave V4 Equities Hub",
    cls: "stocks",
    classLabel: "Tokenized stock",
    collateral: "—",
    borrowed: "$5.10M",
    lltv: "65–79% CF",
    depth: "$0.27–1.08M per token at 2% impact",
    status: "observing",
    statusLabel: "Observing",
    asOf: "Oct 25, 2026",
  },
  {
    market: "Robinhood stock tokens / USDG",
    venue: "Morpho",
    cls: "stocks",
    classLabel: "Tokenized stock",
    collateral: "$3.9M",
    borrowed: "$1.69M",
    lltv: "62.5%",
    depth: "—",
    status: "observing",
    statusLabel: "Observing",
    asOf: "Oct 25, 2026",
  },
  {
    market: "Blend V2 pools",
    venue: "Blend",
    cls: "mixed",
    classLabel: "Mixed pools",
    collateral: "$132M TVL",
    borrowed: "$39.5M",
    lltv: "per pool",
    depth: "—",
    status: "live",
    statusLabel: "Keepers on testnet",
    asOf: "Oct 25, 2026",
  },
  {
    market: "hBTC / USDC",
    venue: "Suilend, NAVI",
    cls: "btc",
    classLabel: "Wrapped BTC",
    collateral: "—",
    borrowed: "—",
    lltv: "—",
    depth: "—",
    status: "watching",
    statusLabel: "Hashi launching",
    asOf: "Oct 2026",
  },
];

/* Curator console -------------------------------------------------------- */

export type CuratorMarket = {
  id: string;
  name: string;
  venue: string;
  /** $M; null when not measured. */
  collateral: number | null;
  borrowed: number | null;
  depth: number | null;
  lltv: string;
  asOf: string;
  /** Collateral ($M) that becomes liquidatable at each price fall. */
  tail: Array<{ fall: string; amount: number }> | null;
  note: string;
};

export const CURATOR_MARKETS: CuratorMarket[] = [
  {
    id: "cirbtc",
    name: "cirBTC / USDC",
    venue: "Morpho",
    collateral: 274.0,
    borrowed: 178.4,
    depth: 23.9,
    lltv: "86%",
    asOf: "Oct 25, 2026",
    tail: [
      { fall: "10%", amount: 0.035 },
      { fall: "15%", amount: 6.3 },
      { fall: "20%", amount: 103.9 },
      { fall: "30%", amount: 245.5 },
    ],
    note: "",
  },
  {
    id: "ptreusd",
    name: "PT-reUSD-10DEC2026 / USDC",
    venue: "Morpho",
    collateral: 67.5,
    borrowed: 52.2,
    depth: 8.97,
    lltv: "91.5%",
    asOf: "Aug 25, 2026",
    tail: null,
    note: "Depth is the Pendle pool. On Aug 25 one wallet's sales moved the PT price about 3% and liquidated $36.1M here; Macaulay buyers hold to the Dec 10 maturity instead of selling into the pool.",
  },
  {
    id: "rhstocks",
    name: "Robinhood stock tokens / USDG",
    venue: "Morpho",
    collateral: 3.9,
    borrowed: 1.69,
    depth: null,
    lltv: "62.5%",
    asOf: "Oct 25, 2026",
    tail: null,
    note: "Six stock tokens back these loans. Issuers can pause transfers, and prices hold over weekends, so we measure depth per token and per market session before quoting.",
  },
  {
    id: "basestocks",
    name: "Coinbase stock tokens / USDC",
    venue: "Aave V4 Equities Hub",
    collateral: null,
    borrowed: 5.1,
    depth: null,
    lltv: "65–79% CF",
    asOf: "Oct 25, 2026",
    tail: null,
    note: "About $0.27–1.08M of depth per token at 2% price impact. Aave holds the last price from Friday 8pm to Sunday 8pm ET, so weekend exits need a buyer that can hold until Monday.",
  },
];
