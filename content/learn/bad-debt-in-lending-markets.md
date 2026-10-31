---
title: Where bad debt in lending markets comes from
metaTitle: Where DeFi lending bad debt comes from
crumb: Bad debt in lending markets
description: "Bad debt appears when collateral is worth less than the debt and liquidation can't make up the difference, most often because the collateral can't be sold in time."
type: article
status: draft
eyebrow: LEARN
updated: 2026-10-31
related:
  - /learn/what-is-exit-capacity
  - /learn/dex-depth-and-collateral-caps
  - /faq
---

Bad debt appears when a borrower's collateral is worth less than their debt and liquidation can't recover the difference. In practice it usually comes from collateral that can't be sold fast enough: prices gap past the liquidation threshold, DEX pools thin out, and some positions are left with nobody willing to buy.

It is the failure that every other part of a lending market's design exists to prevent.

## What is bad debt in a lending market?

A lending market lends one asset against another. As long as each borrower's collateral is worth more than their debt, lenders can always be repaid: if a borrower doesn't repay, the market sells their collateral and uses the proceeds.

Bad debt is what's left when that stops being true. If a position's collateral is worth less than its debt, even selling all of it won't repay the loan. The shortfall is debt that no one will repay.

## How is liquidation supposed to prevent it?

Lending markets keep a buffer between the value of the collateral and the size of the loan. The liquidation threshold, or [LLTV](/learn/glossary#lltv) on Morpho, sets where that buffer runs out: once a position's loan-to-value crosses it, anyone can liquidate it.

A liquidator repays some or all of the debt and receives collateral worth more than it repaid. That difference, the [liquidation bonus](/learn/glossary#liquidation-bonus), pays liquidators to act quickly. As long as positions are liquidated while their collateral is still worth more than their debt, the market stays solvent.

The whole system depends on one assumption: that the collateral can be sold for close to the price the market uses to value it. Every loan assumes a buyer. On a calm day, nobody checks.

## Where does bad debt actually come from?

Bad debt nearly always traces back to one of a few failures, and most of them are about the exit.

| Source | What goes wrong |
| --- | --- |
| Price gaps | The price falls past the whole buffer before anyone can liquidate, so the collateral is already worth less than the debt |
| Thin DEX depth | The collateral can be liquidated, but selling it drives the price so far down that it doesn't cover the debt |
| Liquidations that aren't worth doing | The bonus doesn't cover the expected loss on the sale, so no liquidator steps in and positions sink further |
| Prices that can't update | Weekend gaps or issuer pauses for tokenized stocks mean the market can't see or act on the real price |
| Exits that take time | Redemption and withdrawal queues mean the collateral's real value can't be reached in the minutes a liquidation needs |

They tend to arrive together. When prices gap, DEX pools thin and bots take the easy positions. Unsold collateral becomes bad debt.

## Why does thin DEX depth cause so much of it?

Because liquidations are forced sales that arrive all at once. A price move that pushes one position over its threshold pushes every similar position over too, and they all sell into the same pools.

If those pools are small compared with the collateral in the market, the sales push the price down, which pushes more positions over their thresholds, which means more sales. On Aug 25, 2026, $36.1M of Morpho loans were liquidated in 14 minutes after one wallet sold PT-reUSD into an $8.97M Pendle pool. [The case study](/research/pt-reusd-liquidations-aug-2026) covers what is known about it.

The size of the gap matters. On Oct 25, 2026, the cirBTC/USDC market on Morpho held $274.0M of cirBTC collateral, according to the Morpho API, against about $23.9M of DEX liquidity: an [exit gap](/learn/glossary#exit-gap) of about $250.1M.

## Who absorbs bad debt?

It depends on the market's design. In many designs the loss falls on the lenders who supplied that market or the vault that allocated to it. Some protocols hold reserves to absorb losses first.

Either way, someone who did nothing wrong takes the loss. That's why curators, who decide which collateral their markets accept, are cautious about anything they can't see a clear exit for.

## Is a fully borrowed market the same problem?

It's a related one. When a market's utilization hits 100%, every unit lenders supplied has been borrowed, so lenders can't withdraw until borrowers repay or are liquidated. After the Kelp exploit in April 2026, Aave's WETH pool reached 100% utilization, and lenders could not withdraw.

That isn't bad debt: lenders are still owed their money. But it's the same root cause from the other side. The market can only return funds as fast as it can close positions, and that depends on whether the collateral can be sold.

## Why do curators keep caps low on illiquid collateral?

A [supply cap](/learn/glossary#supply-cap) limits how much of an asset a market will accept in total. A curator who can't count on a reliable exit for an asset keeps its cap low, so a crash can never force more of it onto the market than can be sold.

That's the right call for safety, but it caps growth: borrowers who want to post that collateral can't. [Why DEX depth limits collateral caps](/learn/dex-depth-and-collateral-caps) covers the trade-off.

## What reduces bad debt from thin exits?

The options all come down to making sure there is a buyer:

- **Caps sized to the real exit**, measured during the kind of move that would trigger liquidations, not on a calm day.
- **Committed buyers** who agree in advance to take collateral at a set price, with funds already in escrow, so their bids don't vanish when pools thin out.
- **Buyers who can hold to redemption** for collateral that redeems later, instead of selling into the same pool that caused the fall.
- **Keepers that act early** and route each liquidation to an exit that can absorb it.

Nectar Network is exit infrastructure for lending markets: it lines up funded buyers for collateral so liquidations can clear when DEX liquidity can't absorb them. It is in development, and a small pilot cohort of curators, lending protocols and buyers comes first. [How it works](/how-it-works) covers the design, and you can [talk to us](/contact) about the pilot.
