---
title: What is exit capacity for collateral?
description: "Exit capacity is how much of a collateral asset can be sold in a liquidation without the price collapsing: what DEX pools can absorb plus bids committed in advance."
type: article
status: draft
eyebrow: LEARN
updated: 2026-10-31
related:
  - /learn/dex-depth-and-collateral-caps
  - /research/cirbtc-collateral-vs-dex-depth
  - /learn/glossary
---

Exit capacity is the amount of a collateral asset that can be sold during liquidations without the price collapsing. For a lending market, it is what DEX pools can absorb plus any bids that buyers have committed in advance.

It is the number a loan quietly depends on. Every collateralised loan assumes that, if the borrower can't repay, someone will buy the collateral for enough to cover the debt. Exit capacity measures whether that buyer actually exists, and how much they can take.

## Why does exit capacity matter to a lending market?

A lending market protects lenders by liquidating borrowers before their debt exceeds the value of their collateral. When a position's loan-to-value crosses the market's liquidation threshold (its [LLTV](/learn/glossary#lltv) on Morpho), anyone can repay part of the debt and take collateral at a discount, the [liquidation bonus](/learn/glossary#liquidation-bonus). The liquidator then usually sells that collateral straight away.

That last step is where things break. If the collateral can't be sold for close to its quoted price, the discount stops covering the loss, liquidators stop showing up, and positions sink below water. What's left is [bad debt](/learn/bad-debt-in-lending-markets), and lenders in that market absorb it.

So the safety of a market doesn't only depend on prices and parameters. It depends on how much collateral can leave the market, at a reasonable price, in the minutes after prices move. That is exit capacity.

## How is exit capacity different from collateral size?

Collateral size is how much of an asset sits in a market. Exit capacity is how much of it could be sold if it had to be. The two can be very far apart.

On Oct 25, 2026, the cirBTC/USDC market on Morpho held $274.0M of cirBTC collateral, according to the Morpho API. DEX liquidity for cirBTC on the same day was about $23.9M.

| Measure | cirBTC/USDC on Morpho, Oct 25, 2026 |
| --- | --- |
| Collateral at stake | $274.0M |
| DEX liquidity | ≈ $23.9M |
| Share of collateral DEX liquidity covers | ≈ 8.7% |
| Exit gap (collateral a DEX cannot absorb) | $250.1M |

The market looks large and well collateralised. But if a large part of that collateral needed to be sold at once, the pools behind it could absorb less than a tenth. [The full case study](/research/cirbtc-collateral-vs-dex-depth) gives the sources and method.

## What makes up exit capacity?

Exit capacity has three possible sources, and they behave very differently under stress.

**DEX depth.** How much of an asset AMM pools and order books can absorb before the price moves by more than a chosen percentage. It changes minute to minute, and it tends to shrink exactly when it's needed: when prices gap, liquidity providers pull back and bots take the easy positions.

**Committed bids.** Buyers who have agreed in advance to take collateral at a set price, with the funds already in escrow. A committed bid doesn't disappear when a pool thins out, because the money is already locked against it. This is what a [funded quote](/learn/funded-quote-settlement) provides.

**Redemption.** Some collateral can be redeemed with its issuer: a principal token at maturity, a queued credit token when the queue clears, a liquid staking token through a withdrawal queue. Redemption sets a floor on value, but it isn't instant, so it can't repay a loan in the minutes a liquidation needs.

## What is an exit gap?

An exit gap is the part of a market's collateral that DEX depth can't absorb: collateral at stake minus DEX depth. For cirBTC/USDC on Morpho on Oct 25, 2026, that was $274.0M minus about $23.9M, an exit gap of about $250.1M.

An exit gap doesn't mean a market will fail. Liquidations rarely hit all collateral at once, and many positions sit well below their threshold. But it shows how much the market is relying on prices never falling far or fast enough to put a large share of its collateral up for sale at the same time.

## Why isn't DEX depth on a calm day enough?

Depth measured on an ordinary day overstates what will be there in a crash, for three reasons.

1. **Liquidations cluster.** A price move that pushes one position over its threshold pushes many others over at the same time, so they all compete for the same pools.
2. **Liquidity leaves.** Providers withdraw when volatility rises, so pools are thinner when they're most needed.
3. **Selling moves the price that triggered the sale.** Each liquidation sale pushes the price down, which can push more positions over the threshold.

On Aug 25, 2026, $36.1M of Morpho loans were liquidated in 14 minutes after one wallet sold PT-reUSD into an $8.97M Pendle pool: a single sale into a thin pool, followed by a wave of liquidations. [The case study](/research/pt-reusd-liquidations-aug-2026) covers what is known about it.

## How do curators use exit capacity?

Curators and risk managers decide which collateral a market accepts, the LLTV, and the [supply cap](/learn/glossary#supply-cap): how much of the asset the market will take in total. When they can't see a reliable exit, the safe choice is a low cap. Unsold collateral becomes bad debt, so curators keep caps low.

That has a cost. A low cap limits how much can be borrowed against an asset, even when demand is there. [Why DEX depth limits collateral caps](/learn/dex-depth-and-collateral-caps) explains the trade-off in more detail.

Committed exit capacity gives curators a number they can size a cap against: collateral that buyers have already agreed, and funded, to take.

## How would Nectar measure and publish it?

Nectar Network is exit infrastructure for lending markets: it lines up funded buyers for collateral so liquidations can clear when DEX liquidity can't absorb them. Two parts of it deal with exit capacity directly, and both are in development.

- **Nectar Feed** is designed to publish committed exit capacity per asset and market, readable onchain by cap-setters.
- **A depth study** for each pilot partner measures how much of their collateral a DEX can absorb, before anyone quotes capacity.

How committed bids get counted toward the Feed is one of the rules the pilot cohort helps set. If you curate a market or run a lending protocol, [talk to us](/contact) about the pilot.
