---
title: The Aug 25, 2026 PT-reUSD liquidations on Morpho
metaTitle: PT-reUSD liquidations on Morpho, Aug 25 2026
crumb: PT-reUSD liquidations, Aug 25, 2026
description: "On Aug 25, 2026, $36.1M of Morpho loans against PT-reUSD were liquidated in about 14 minutes, with no bad debt. What the onchain record shows, step by step."
type: article
status: draft
eyebrow: RESEARCH
updated: 2026-10-31
related:
  - /learn/principal-token-collateral
  - /research/cirbtc-collateral-vs-dex-depth
  - /learn/bad-debt-in-lending-markets
---

On Aug 25, 2026, $36.1M of Morpho loans backed by PT-reUSD were liquidated in about 14 minutes, from 04:37:47 to 04:51:23 UTC. In the nine minutes before the first liquidation, 5.43M PT-reUSD went into its Pendle pool, which held about 8.9M in reUSD terms beforehand. The liquidations left no bad debt. It's a clear example of how a principal token's thin exit before maturity can turn one burst of selling into a wave of liquidations.

Every figure below comes from the onchain record: Morpho's `Liquidate` events and market state, the markets' oracle, and the Pendle market's `Swap` events, read on Oct 31, 2026. Where two published accounts disagree, both are shown next to what the record says.

## What happened?

| Measure | Value | How it was measured |
| --- | --- | --- |
| Date and window | Aug 25, 2026, 04:37:47 to 04:51:23 UTC (13 min 36 s) | First and last `Liquidate` event |
| Collateral | PT-reUSD-10DEC2026, a Pendle principal token maturing Dec 10, 2026 | Token contract |
| Liquidations | 33, in 32 transactions | `Liquidate` events on Morpho |
| Debt repaid | 35,188,279.71 USDC + 955,966.41 USDT = **$36.1M** | Sum of `repaidAssets` (stablecoins at $1) |
| Collateral seized | 38,638,597.70 PT-reUSD | Sum of `seizedAssets` |
| Bad debt | 0 | `badDebtAssets` in all 33 events |
| Borrowers liquidated | 19 | Distinct `borrower` |
| Markets | Two Morpho markets, both at 91.5% LLTV: PT-reUSD/USDC and PT-reUSD/USDT | Market parameters |

The two markets, with their Morpho market IDs:

| Market | Market ID | Liquidations | Borrowed before the first liquidation |
| --- | --- | --- | --- |
| PT-reUSD/USDC | `0x1e9d614631a7df0ec07fb05b2c8cb2491575fd1a63a33bf187a6afb295a4fc64` | 16 | 71,104,915.65 USDC |
| PT-reUSD/USDT | `0x6acd18854e43f93f5a90446004c35c72a68af1ad99f08cb247782ce6457914ca` | 17 | 5,721,070.32 USDT |

Together the two markets had about $76.8M borrowed just before the first liquidation, as recorded at each market's last update (04:34:23 and 04:36:35 UTC).

The first liquidation is transaction `0x30b204d271d492c16e3866564cf11a391ea936ee9dac4e8e2303843a47066a44` (block 25,829,868); the last is `0xb375599d0fa4ecc29e142974ab64d4e10501da0a19f04e69b7cf130c4c47cb83` (block 25,829,936).

## What came before the liquidations?

Between 04:28:47 and 04:37:35 UTC, 11 swaps through the Pendle Router moved 5,428,402.65 PT-reUSD into the Pendle market (`0x13285bcbc27f92b47b4edb99d744c07b48c977c0`) for 4,746,323.16 of its SY token. The pool's price fell from 0.88392 to 0.86297 SY per PT. The last of those swaps landed 12 seconds before the first liquidation.

Just before the swaps (block 25,829,822), the pool held 3,122,355.43 PT and 5,367,253.49 SY, about 8.91M in reUSD terms at the SY exchange rate of the time. We didn't check reUSD's dollar price at that moment.

## How did the price reach the lending markets?

Both markets read the same oracle (`0x217d6ddcdb95112c51657f6270e8c079cfdb51f0`). Its verified source takes the lower of two price feeds. The feed that was lower throughout the event is configured with this Pendle market and a 900-second (15-minute) averaging window.

| Time (UTC) | Oracle price, USDC per PT |
| --- | --- |
| ≈ 04:29 (block 25,829,824) | 0.97098 |
| 04:37:35, block before the first liquidation | 0.96604 |
| 04:51:23, last liquidation | 0.94419 |

From about 04:29 to the last liquidation, the oracle price fell 2.76%. Because each position's value comes from that price, a fall of under 3% was enough to push 19 borrowers at a 91.5% LLTV over their thresholds within 14 minutes.

## Where do published accounts differ?

Two secondary sources covered the event: [CryptoDaily](https://cryptodaily.co.uk/2026/08/pt-reusd-morpho-liquidations-36m) and [1delta's Tuesday brief](https://www.1delta.io/blog/tuesday-brief-2026-08-25/). They agree on about $36.1M repaid, a 04:37 to 04:51 UTC window, a pool of about $9M, a 91.5% LLTV, a Dec 10, 2026 maturity and no bad debt, all of which the record confirms. 1delta adds that one address sold 5.43M PT just before the liquidations. The record confirms 5.43M PT entering the pool in that window; we checked the sender of four of the 11 swaps individually, and all four came from the same address.

Where they differ:

| Point | One account | The other | The onchain record |
| --- | --- | --- | --- |
| Number of liquidations | 33 | 32 | 33 liquidation events in 32 transactions (one transaction held two) |
| PT price move | 2.8% | 1.0% | The markets' oracle price fell 2.76% |
| Market size | $67.5M collateral, $52.2M borrowed | $79M / $63M across markets | $76.8M borrowed across the two markets before the first liquidation; collateral is held in one balance for several markets, so we don't give a per-market figure |

## Why could one burst of selling liquidate so much?

Because the pool that sets a principal token's price before maturity is also the pool its liquidators have to sell into. A PT usually has one main AMM pool per maturity, and that pool can be much smaller than the PT collateral held in lending markets. Here, about 38.6M PT was seized against a pool that held about 3.1M PT beforehand.

When selling lowers the pool's price, every position valued from that price loses value at once. Positions near their threshold become liquidatable, their liquidators sell into the same pool, and the price falls again. [Principal tokens as collateral](/learn/principal-token-collateral) explains the mechanism in full.

## What does this show about PT collateral?

1. **Pool size, not collateral quality, set the outcome.** PT-reUSD redeems for reUSD at maturity, and the oracle price was back to 0.968 within about half an hour. The liquidations happened because the exit before maturity was small.
2. **Speed matters.** Fourteen minutes is too short for anyone to raise new liquidity or step in as a buyer after the fact.
3. **Liquidators had to sell, not hold.** A buyer who could hold the PT to maturity would value it against its redemption, not against the pool. No such buyer was committed in advance.

## What would have changed the outcome?

Committed buyers who price PTs against redemption value and time to maturity, with funds already in escrow, could absorb positions without selling into the pool, and a lending market could count their quotes when setting limits. That's the design of Macaulay, Nectar's pricing protocol for collateral that redeems later, and of the committed quotes Pappus settles. Both are in development. This case study doesn't claim they would have absorbed this event, because no such capacity existed and its size would have depended on what buyers committed.

## What are the limits of this account?

- It doesn't identify who controls the address behind the swaps, or claim to know why they were made.
- It doesn't measure how close each position was to its threshold before the event.
- It values USDC and USDT at $1 and doesn't convert reUSD amounts to dollars.

<!-- REVIEW: The market totals don't reconcile with the liquidation sums: between the block before the first liquidation and the last one, USDC-market borrowing fell by only about 4.30M although 35.19M was repaid, and Morpho's PT balance fell by about 1.49M although 38.64M was seized. That suggests new borrowing and collateral in the same window (for example, positions being re-opened), but it hasn't been checked. Explain or accept before publishing. -->
<!-- REVIEW: The 11 swaps minted PT directly into the pool and sent SY to the YT contract, which looks like a Router YT purchase rather than PT sold from a wallet (inferred, not decoded). The page says "moved PT into the pool" for that reason; the home page says "one wallet sold into an $8.97M Pendle pool". Decide whether the home wording should change. The pool measured about 8.91M in reUSD terms at block 25,829,822. -->
<!-- REVIEW: The second oracle feed (0x7cfd3ed001d9d65d4022db4e15c6101db2bbc994) is of unknown type, and the first feed's source wasn't inspected; "900-second averaging window" comes from its twapDuration() setting. CreateMarket events were scanned only for blocks 25,294,458 to 25,394,458, so a PT-reUSD market created later could be missing (only the two markets above had liquidations in the window). -->
