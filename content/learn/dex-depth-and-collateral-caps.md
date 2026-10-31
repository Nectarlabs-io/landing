---
title: Why DEX depth limits how much collateral a lending market can accept
metaTitle: Why DEX depth limits collateral caps
crumb: DEX depth and collateral caps
description: "A lending market can safely hold only as much collateral as a liquidation can sell. When DEX depth is thin, curators must keep supply caps low or risk bad debt."
type: article
status: draft
eyebrow: LEARN
updated: 2026-10-31
related:
  - /learn/what-is-an-exit-backed-borrowing-limit
  - /learn/what-is-exit-capacity
  - /learn/bad-debt-in-lending-markets
  - /learn/principal-token-collateral
---

A lending market can only safely hold as much of an asset as can be sold, at a price that still covers the debt, in the minutes after prices move. When DEX depth is far below the collateral a market holds, curators have two choices: keep supply caps low, or accept a higher chance of bad debt.

That is why so much collateral that people want to borrow against is capped at modest amounts. The limit usually isn't the asset's quality. It's the exit.

## What happens to collateral during a liquidation?

When a borrower's loan-to-value crosses the market's liquidation threshold ([LLTV](/learn/glossary#lltv) on Morpho), the position becomes liquidatable. A liquidator, usually a bot or [keeper](/learn/glossary#keeper), repays some or all of the debt and receives collateral worth more than it repaid. The difference is the [liquidation bonus](/learn/glossary#liquidation-bonus), and it's what pays the liquidator for the work and the risk.

Almost every liquidator then sells the collateral immediately, because holding it means carrying its price risk. So a liquidation is really a forced sale. It only works if the sale clears at a price close to the one the market used to value the collateral.

## What is DEX depth?

DEX depth is how much of an asset decentralised exchanges can absorb before the price moves by more than a chosen amount. It is usually quoted against a price impact: the amount you could sell before the price drops by a given percentage.

Depth isn't a fixed property of an asset. It depends on which pools exist, how much liquidity sits in them, how that liquidity is spread across prices, and what's happening in the market at that moment. It can be measured, but only for a given time and a given price impact.

## Why do liquidations need more depth than ordinary trading?

Ordinary trading spreads selling across time and across many independent decisions. Liquidations don't.

- **They arrive together.** A price move that pushes one position over its threshold pushes every similar position over too, so many sales hit the same pools at once.
- **They arrive when depth is thinnest.** When prices gap, liquidity providers pull back and bots take the easy positions. Pools are at their thinnest just when the most collateral needs to leave.
- **They feed on themselves.** Each forced sale pushes the price down, which can push more positions over the threshold and trigger more forced sales.

So a curator can't size a market against calm-day depth. They have to ask how much could be sold during the kind of move that would trigger large liquidations in the first place.

## How do curators turn depth into a supply cap?

A curator, or a lending protocol's risk team, controls a few levers for each collateral asset:

| Lever | What it controls | Effect of thin depth |
| --- | --- | --- |
| LLTV | How far a position can fall before liquidation | Set lower, so liquidations start earlier with a bigger buffer |
| Liquidation bonus | How much liquidators earn per liquidation | Set higher, to pay for worse execution, which costs borrowers more |
| [Supply cap](/learn/glossary#supply-cap) | How much of the asset the market accepts in total | Set lower, so less collateral can ever need to be sold at once |

Of these, the supply cap does the most direct work. If a market never holds more collateral than the exit can absorb, a crash can't leave it with more collateral than it can sell.

That's also why thin depth caps growth. When a cap fills, nobody else can deposit that collateral, however strong the demand. On Oct 9, 2026, LlamaRisk reported that a 30M PT-AUSD supply cap had filled on an Aave market. Exit for that collateral still depends on buyers or redemption.

## What does a thin market look like in numbers?

The cirBTC/USDC market on Morpho is a clear example. On Oct 25, 2026, it held $274.0M of cirBTC collateral, according to the Morpho API, while DEX liquidity for cirBTC was about $23.9M.

That means DEX depth covered about 8.7% of the collateral. The rest, an exit gap of about $250.1M, is collateral a DEX couldn't absorb if it all had to be sold. [The case study](/research/cirbtc-collateral-vs-dex-depth) shows the figures, sources and method.

None of this means the market is about to fail. It means the market relies on prices never falling far or fast enough to force a large share of that collateral onto the market at once.

## Which collateral has the biggest depth problem?

The gap between collateral and depth is widest for assets whose main exit isn't a deep, always-on market.

| Collateral class | Where it's borrowed against | Exit problem |
| --- | --- | --- |
| Wrapped BTC | Morpho (cirBTC) | DEX depth far below collateral |
| Principal tokens | Morpho, Aave, Euler | One thin Pendle pool until maturity |
| Tokenized real-world assets | Aave V4, Morpho, Kamino, Blend | Market hours, issuer pauses, redemption queues |
| LSTs and LRTs | Aave, Morpho, Lido Lend | Withdrawal queues |

[Principal tokens](/learn/principal-token-collateral) are an especially sharp case: their main exit before maturity is often a single AMM pool, so liquidations sell into the same pool that sets the price.

## How can committed bids change the calculation?

The underlying problem is that DEX depth is uncommitted. Nobody has promised to be there when prices fall. Committed bids are different: a buyer agrees in advance to take collateral at an oracle-referenced price, and the funds sit in escrow for at least a notice period, until a position closes or the buyer withdraws.

Committed capacity doesn't vanish when pools thin out. That changes what a limit can be set against. Instead of a static ratio chosen to survive the worst day, a market can cap borrowing at the asset's [recoverable value](/learn/glossary#recoverable-value): committed quotes, a house buyer's quotes and verified DEX depth, minus a [haircut](/learn/glossary#haircut), and never above the usual oracle limit. [What is an exit-backed borrowing limit?](/learn/what-is-an-exit-backed-borrowing-limit) works through an example.

This is what Nectar Network is built for. Nectar Network is credit and liquidity for tokenized assets: lending markets whose borrowing limits are backed by committed buyers, so loans can go further and positions still close when DEX liquidity can't absorb them. [Nectar Feed](/how-it-works) is designed to publish committed exit capacity per asset and market, readable onchain, and each limit is set from it. Like every part of Nectar, it is in development, and a small pilot cohort comes first.

If you lend or curate, and your limits are set by the exit rather than the asset, [talk to us](/contact).
