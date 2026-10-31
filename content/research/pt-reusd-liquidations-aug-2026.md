---
title: The Aug 25, 2026 PT-reUSD liquidations on Morpho
metaTitle: PT-reUSD liquidations on Morpho, Aug 25 2026
crumb: PT-reUSD liquidations, Aug 25, 2026
description: "On Aug 25, 2026, $36.1M of Morpho loans were liquidated in 14 minutes after one wallet sold PT-reUSD into an $8.97M Pendle pool. What happened and what it shows."
type: article
status: draft
eyebrow: RESEARCH
updated: 2026-10-31
related:
  - /learn/principal-token-collateral
  - /research/cirbtc-collateral-vs-dex-depth
  - /learn/bad-debt-in-lending-markets
---

On Aug 25, 2026, $36.1M of Morpho loans were liquidated in 14 minutes after one wallet sold PT-reUSD into an $8.97M Pendle pool. It's a clear example of how a principal token's thin exit before maturity can turn one sale into a wave of liquidations.

## What happened?

| Measure | Value | Source |
| --- | --- | --- |
| Date | Aug 25, 2026 | Onchain events |
| Collateral | PT-reUSD (principal token, matures Dec 10, 2026) | Pendle market |
| Loans liquidated | $36.1M | Morpho |
| Time window | 14 minutes | Onchain events |
| Pendle pool the sale went into | $8.97M | Pendle |

<!-- REVIEW: Primary sources needed before publishing: the liquidation transactions (or a Morpho API query) behind $36.1M, how the 14-minute window was defined (first to last liquidation?), and the pool-size snapshot ($8.97M at what time). Please share links or the query so this page can cite them directly. -->
<!-- REVIEW: Confirm the liquidated loans were in the PT-reUSD/USDC market on Morpho (the internal screens say so) and that the Dec 10, 2026 maturity is right for this PT. -->

The sequence, as far as the figures above show it: a single wallet sold PT-reUSD into its Pendle pool. The PT's price in that pool fell. PT-reUSD positions on Morpho crossed their liquidation thresholds, and over the next 14 minutes $36.1M of loans were liquidated.

## Why could one sale liquidate so much?

Because the pool that sets a principal token's price before maturity is also the pool its liquidators have to sell into. A PT usually has one main AMM pool per maturity, and that pool can be much smaller than the PT collateral held in lending markets.

When a large sale lowers the pool's price, every position valued from that price loses value at once. Positions near their threshold become liquidatable, their liquidators sell into the same pool, and the price falls again. [Principal tokens as collateral](/learn/principal-token-collateral) explains the mechanism in full.

<!-- REVIEW: How did this market's oracle value PT-reUSD (pool price, a discount curve to maturity, or the lower of the two)? The internal quote screen described "the lower of the 15-minute Pendle price and a 6% discount curve". Confirm before this page says how prices reached the market. -->

## What does this show about PT collateral?

Three things, each of which applies beyond this one market:

1. **Pool size, not collateral quality, set the outcome.** PT-reUSD redeems for reUSD at maturity. The liquidations happened because the exit before maturity was small, not because anything was known to be wrong with the underlying.
2. **Speed matters.** Fourteen minutes is too short for anyone to raise new liquidity or step in as a buyer after the fact.
3. **Liquidators had to sell, not hold.** A buyer who could hold the PT to maturity would value it against its redemption, not against the pool. No such buyer was committed in advance.

## What would have changed the outcome?

Committed buyers who price PTs against redemption value and time to maturity, with funds already in escrow, could absorb liquidations without selling into the pool. That's the design of Macaulay, Nectar's pricing protocol for collateral that redeems later, and of the funded quotes Pappus settles. Both are in development. This case study doesn't claim they would have absorbed this event, because no such capacity existed and its size would have depended on what buyers committed.

## What are the limits of this account?

- It relies on the figures above and doesn't reconstruct every transaction.
- It doesn't identify the wallet or claim to know why it sold.
- It doesn't measure how close other positions were to their thresholds before the sale.

<!-- REVIEW: The internal screens also said the sale moved the PT price "about 3%", and gave the market's size ($67.5M collateral, $52.2M borrowed, 91.5% LLTV). These aren't on the public site, so they're left out. Add them if you can share the primary source. -->
