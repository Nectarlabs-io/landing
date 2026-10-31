---
title: "cirBTC collateral versus DEX depth on Morpho (Oct 25, 2026)"
metaTitle: cirBTC collateral vs DEX depth on Morpho
crumb: cirBTC collateral vs DEX depth
description: "On Oct 25, 2026, Morpho's cirBTC/USDC market held $274.0M of cirBTC collateral against about $23.9M of DEX liquidity, leaving an exit gap of about $250.1M."
type: article
status: draft
eyebrow: RESEARCH
updated: 2026-10-31
related:
  - /learn/what-is-exit-capacity
  - /learn/dex-depth-and-collateral-caps
  - /research/pt-reusd-liquidations-aug-2026
---

On Oct 25, 2026, the cirBTC/USDC market on Morpho held $274.0M of cirBTC collateral, while DEX liquidity for cirBTC was about $23.9M. DEX depth covered roughly 8.7% of the collateral, leaving an exit gap of about $250.1M: collateral a DEX could not absorb if it had to be sold.

## What was measured?

| Measure | Value | Date | Source |
| --- | --- | --- | --- |
| Collateral at stake in cirBTC/USDC | $274.0M | Oct 25, 2026 | Morpho API |
| DEX liquidity for cirBTC | ≈ $23.9M | Oct 25, 2026 | Observed by Nectar |
| Market LLTV | 86% | Oct 25, 2026 | Morpho market parameters |
| Committed bids | None yet | Oct 25, 2026 | First buyers join in the pilot |

<!-- REVIEW: Confirm the source for the $23.9M DEX liquidity figure: which venues and pools were counted, and at what price impact (e.g. depth to a 2% move)? The internal Feed screen said "on Uniswap V3"; confirm before we name a venue. -->
<!-- REVIEW: Confirm "collateral at stake" is the market's total supplied collateral from the Morpho API, valued in USD at the time of the snapshot, and give the exact query or endpoint so the figure can be reproduced. -->

## What was derived?

Two figures follow from the measurements above.

| Derived figure | Calculation | Result |
| --- | --- | --- |
| Exit gap | $274.0M − $23.9M | $250.1M |
| Share of collateral DEX liquidity covers | $23.9M ÷ $274.0M | ≈ 8.7% |

The exit gap is the collateral a DEX couldn't absorb if all of it had to be sold. It's an upper bound on the problem, not a forecast: it assumes the whole position set needed to leave at once.

## What does the gap mean for this market?

It means the market's safety rests on prices never falling far or fast enough to put a large share of its collateral up for sale at the same time. A move like that would push many positions over the 86% LLTV together, and their liquidators would all try to sell into pools that could absorb less than a tenth of the collateral.

That's the situation curators face when they set a [supply cap](/learn/glossary#supply-cap): the asset may be sound, but the exit is small compared with the position. [Why DEX depth limits collateral caps](/learn/dex-depth-and-collateral-caps) explains how that shapes the cap.

## What are the limits of this snapshot?

- **It's one day.** Both collateral and DEX liquidity change constantly. The figures describe Oct 25, 2026 only.
- **DEX liquidity isn't fixed under stress.** Depth measured on an ordinary day tends to shrink when prices gap, so the real exit in a crash may be smaller than measured.
- **Not every position liquidates at once.** How much collateral would actually need selling depends on how close each position sits to its threshold, which this snapshot doesn't measure.
- **No committed bids yet.** Funded quotes would add capacity that doesn't depend on pool depth. None existed for this market on that date.

## Where do the figures appear on this site?

The same snapshot appears on the home page, in the exit capacity card and the first problem statistic. This page is their source note.

<!-- REVIEW: The internal app screens (kept on the app-preview branch) had more figures for this market: $178.4M borrowed, and how much collateral becomes liquidatable at 10%, 15%, 20% and 30% price falls. They aren't on the public site, so they're left out here. Add them if you can share the primary source and method. -->
