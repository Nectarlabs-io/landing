---
title: "Principal tokens as collateral: why liquidations break before maturity"
metaTitle: Why PT liquidations break before maturity
crumb: Principal tokens as collateral
description: "A principal token redeems at par at maturity, but before then it usually exits through one thin pool. Liquidations sell into that pool and push the price below par."
type: article
status: draft
eyebrow: LEARN
updated: 2026-10-31
related:
  - /learn/what-is-an-exit-backed-borrowing-limit
  - /research/pt-reusd-liquidations-aug-2026
  - /learn/dex-depth-and-collateral-caps
  - /learn/funded-quote-settlement
---

A principal token (PT) redeems for its underlying asset at maturity, but before maturity the quickest way to sell it is usually a single AMM pool. When liquidations push a large amount of PT into that pool, the price falls far below what the token will redeem for, and the sales themselves can push more positions into liquidation.

The token isn't the problem. Its exit before maturity is.

## What is a principal token?

A principal token is one half of a yield-bearing asset that has been split in two. A protocol such as Pendle takes a yield-bearing asset and separates it into a principal token, which redeems for the underlying at a fixed maturity date, and a yield token, which collects the yield until then.

Because a PT only pays out at maturity, it trades at a discount to its underlying before then. The size of that discount implies a fixed yield: buy the PT today, hold it to maturity, and the difference between the price you paid and what it redeems for is your return. As maturity approaches, the discount shrinks and the price converges on the underlying's value.

## Why are principal tokens used as collateral?

PTs are attractive collateral for the same reason they're attractive to hold: a known redemption value and a fixed yield. A borrower can deposit PTs, borrow a stablecoin against them, and use the loan to buy more PTs, multiplying their fixed yield.

Demand for this can be large. On Oct 9, 2026, LlamaRisk reported that a 30M PT-AUSD supply cap had filled on an Aave market. Once a cap fills, no one else can deposit that collateral, and exit for the collateral already there still depends on buyers or redemption.

## Why does liquidating a principal token go wrong before maturity?

Three features of PTs combine badly in a liquidation.

**One thin pool.** Before maturity, most PT liquidity sits in a single AMM pool for that maturity. That pool can be much smaller than the PT collateral lending markets hold, and it is shared by everyone who needs to sell.

**Selling moves the price used to value the collateral.** If a lending market values PT collateral from that pool's price, a large sale into the pool lowers the value of every PT position at once, not just the one being sold.

**The discount isn't a loss, but liquidations treat it as one.** A PT that trades well below its usual price during a sell-off may still redeem at par a few weeks later. But a liquidator who receives it has to sell it now, into the same pool, at whatever price the pool gives.

Put together, one large sale can push PT positions over their liquidation threshold. Their liquidators sell into the same pool, which pushes the price down further and triggers more liquidations. The collateral may still redeem in full at maturity, but the loans can't wait that long.

## What happened on Aug 25, 2026?

On Aug 25, 2026, $36.1M of Morpho loans were liquidated in 14 minutes after one wallet sold PT-reUSD into an $8.97M Pendle pool.

[The case study](/research/pt-reusd-liquidations-aug-2026) sets out what is known about the event, its sources and the open questions.

## How should a principal token be priced in a liquidation?

Against what it redeems for, and how long until it does. A PT's fair value before maturity is its redemption value, discounted for the time to maturity and for the risk that the underlying doesn't hold its value until then. That number can be far above the price a thin pool gives during a sell-off.

This is the idea behind Macaulay, Nectar's pricing protocol for collateral that redeems later. It is named after Macaulay duration, which for a PT equals the time to maturity. Macaulay is designed to let buyers quote for PTs at a yield to redemption, not at the DEX price, and to hold to settlement instead of selling into the pool that caused the fall. It is in development.

## What does a buyer holding to maturity carry?

A buyer who takes PT collateral and holds it to maturity carries the underlying's risk until that date. A PT pays par only if the underlying holds its value. If the underlying is a credit or RWA token, that is the issuer's credit risk. If it's a yield-bearing stablecoin, it's the risk that the stablecoin keeps its peg.

That's why Macaulay lists only underlyings a curator already accepts, with exposure capped per issuer. A buyer can set their own price for that risk, and the curator has already decided the underlying belongs in their market.

## What can curators do about PT liquidation risk?

Curators have the usual levers, and each one costs something:

| Lever | Effect | Cost |
| --- | --- | --- |
| Lower supply cap | Less PT can ever need selling at once | Less room to borrow against a popular asset |
| Lower LLTV | Liquidations start earlier, with more buffer | Borrowers can borrow less |
| Value PTs closer to redemption | Fewer liquidations triggered by one sale | A bad underlying can go unnoticed for longer |
| Committed buyers who hold to maturity | Liquidations clear without selling into the pool | Needs buyers to commit funds in advance |

The last lever is what Nectar Network is built for. Nectar Network is credit and liquidity for tokenized assets: lending markets whose borrowing limits are backed by committed buyers, so loans can go further and positions still close when DEX liquidity can't absorb them. For PTs, committed buyers can price the token against its redemption instead of its pool, and because those quotes are committed for a notice period, a lending market can count them when it sets a [borrowing limit](/learn/what-is-an-exit-backed-borrowing-limit). Like every part of Nectar, it's in development, and pilot partners see it first.

If you lend against principal tokens, curate markets that list them, or want to quote them as a buyer, [talk to us](/contact) about the pilot.
