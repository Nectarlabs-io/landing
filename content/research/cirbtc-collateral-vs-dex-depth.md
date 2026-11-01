---
title: "cirBTC collateral versus DEX depth on Morpho (Oct 25, 2026)"
metaTitle: cirBTC collateral vs DEX depth on Morpho
crumb: cirBTC collateral vs DEX depth
description: "On Oct 25, 2026, Morpho's cirBTC/USDC market held $274.0M of cirBTC collateral against about $23.9M of DEX liquidity, leaving an exit gap of about $250.1M."
type: article
status: draft
eyebrow: RESEARCH
updated: 2026-11-01
related:
  - /learn/what-is-exit-capacity
  - /learn/dex-depth-and-collateral-caps
  - /research/pt-reusd-liquidations-aug-2026
---

On Oct 25, 2026, the cirBTC/USDC market on Morpho held $274.0M of cirBTC collateral, while DEX liquidity for cirBTC was about $23.9M. DEX depth covered roughly 8.7% of the collateral, leaving an exit gap of about $250.1M: collateral a DEX could not absorb if it had to be sold.

## What was measured?

| Measure | Value | Date | Source |
| --- | --- | --- | --- |
| Collateral at stake in cirBTC/USDC | $274.0M (3,405.96 cirBTC) | Oct 25, 2026 | Morpho API |
| Borrowed in cirBTC/USDC | $178.4M | Oct 25, 2026 | Morpho API |
| DEX liquidity for cirBTC | ≈ $23.9M | Oct 25, 2026 | Observed by Nectar |
| Market LLTV | 86% | Oct 25, 2026 | Morpho market parameters |
| Committed bids | None yet | Oct 25, 2026 | First buyers join in the pilot |

The market's Morpho ID is `0xc2db905f174e5defcce01d321b09f15f78856a36a21b90cc7e1abbc29225815d`. Its collateral moved with the cirBTC price during the day: Morpho's hourly values for Oct 25 run from $272.9M to $275.3M, and the figure used here, $274.0M, is the 12:00 UTC value. Borrowing stayed at about $178.4M all day.

<!-- REVIEW: Collateral, borrowing and LLTV were re-pulled from the Morpho API on Nov 1, 2026 (market 0xc2db…815d, historicalState at HOUR interval, Oct 25 00:00 to 24:00 UTC) and match the figures above, so the home page is unchanged. Still open: the ≈ $23.9M DEX figure has no cited pool. The largest cirBTC Uniswap V3 pool found, WBTC/cirBTC 0.01% (0xcceef8a17d01e0097bd1ab51687754c86456363b), held about $23.1M on Oct 31, but it's on a different chain from this market, so its liquidators may not reach it directly. The Uniswap V3 pool on the market's own chain (0x82916bee18fCEF517B26C72d7Cb5F13694E1dB41) held 70.92 cirBTC on Oct 31; its other side wasn't read. Send the pool address(es) the $23.9M came from, or decide how to describe DEX liquidity that sits on another chain. -->

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

<!-- REVIEW: The internal app screens (kept on the app-preview branch) also showed how much collateral becomes liquidatable at 10%, 15%, 20% and 30% price falls. They're still left out: the Morpho figures above are market totals, not per-position thresholds. Add them if you can share the source and method. -->
