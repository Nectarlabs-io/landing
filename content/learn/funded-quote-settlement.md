---
title: How a funded quote settles a liquidation in one transaction
metaTitle: How a funded quote settles a liquidation
crumb: Funded quote settlement
description: "A funded quote is a standing bid for collateral backed by USDC in escrow. Settlement repays the borrower's debt and delivers the collateral to the buyer in one step."
type: article
status: draft
eyebrow: LEARN
updated: 2026-10-31
related:
  - /learn/committed-quotes-notice-periods-and-commitment-fees
  - /how-it-works
  - /learn/what-is-exit-capacity
  - /learn/glossary
---

A funded quote is a standing bid for a collateral asset, backed by USDC held in escrow. When a position can't be closed through a DEX or prop AMM, Pappus, Nectar's settlement protocol, is designed to take USDC from committed quotes, repay the borrower's debt to the lending market and deliver the collateral to the buyer, all in one transaction.

Pappus is in development, as is every part of Nectar Network, so this article describes the design rather than something you can use today.

## What is a funded quote?

A funded quote is an offer to buy a specific collateral asset, at a price referenced to an oracle, with the money already set aside. A buyer posts it once and it stands until it fills or the buyer withdraws it after a notice period.

A quote has a few terms:

| Term | What it means |
| --- | --- |
| Price | What the buyer will pay, referenced to an oracle price; the buyer can reprice it cheaply |
| Size | The most collateral the quote will take, committed for the notice period |
| Partial fills | Whether the quote can be filled in pieces |
| [Notice period](/learn/glossary#notice-period) | How long committed size stays after the buyer gives notice to withdraw it, so a quote can't vanish the moment it's needed |

The USDC behind a quote sits in escrow. Each dollar backs one active quote, so a quote can never promise more than it holds, and the same dollar can't be counted twice. The buyer receives collateral only when a position closes against their quote. Until then the funds stay theirs.

## What happens when a quote fills?

Here is the designed sequence, from a position becoming liquidatable to the buyer holding collateral:

1. **A position crosses its threshold.** A borrower's loan-to-value passes the market's [LLTV](/learn/glossary#lltv), so the position can be liquidated.
2. **A keeper flags it.** A bonded [Nectar keeper](/learn/glossary#keeper) watching the market picks up the position.
3. **Nectar Route checks depth.** If a DEX or prop AMM can absorb the position, it is liquidated and filled there in one transaction.
4. **If the pool is too thin, Pappus settles against committed quotes.** In one transaction, it uses the quotes' escrowed USDC to repay the borrower's debt to the lending market and delivers the collateral to the buyers. Nectar Reserve, the house prop AMM, fills last.

The lending market gets its debt repaid. Each buyer gets collateral at the price in their quote. And no one had to sell into a pool too thin to take the size.

## Why does one transaction matter?

Settling in a single transaction removes the most dangerous moment in a normal liquidation: the gap between taking the collateral and selling it.

In a DEX liquidation, a liquidator repays debt, receives collateral, and then has to sell that collateral before its price moves further. If the pool is thin, the sale can come in well below the price the market used, and the liquidator may decide the trade isn't worth doing at all.

With committed quotes, the buyers and the prices are set before the liquidation starts. The repayment and the delivery either both happen or neither does, so nobody is left holding collateral they didn't agree to buy.

## Who sets the price?

Buyers do. A quote's price is referenced to an oracle, and where it sits against that oracle is the buyer's decision, as is the risk that it turns out to be too high. Because repricing is cheap, a buyer can keep a quote current without giving up their place.

For collateral that redeems later, such as [principal tokens](/learn/principal-token-collateral) or queued credit tokens, Nectar's second protocol, Macaulay, is designed to price quotes against redemption value and the time to redemption rather than against the DEX price. A buyer who plans to hold to redemption doesn't need to sell into the same pool that caused the fall. Macaulay lists only underlyings a curator already accepts, with exposure capped per issuer.

## Who carries the risk?

Nectar's core is kept thin on purpose, so that each risk sits with the party best placed to judge it.

- **Lending markets, escrow and settlement** are separate, minimal contracts. Pappus only settles and holds escrow; it doesn't choose prices or decide which collateral a market accepts.
- **Buyers** carry pricing risk on their own quotes: they choose what to pay and how much to commit.
- **Nectar Reserve** is one buyer among many, never the only bid a borrowing limit counts on.
- **Lenders and curators** decide which collateral their markets accept, and on what terms.
- **Keepers** carry the risk to their own bond. Keepers bond USDC, never a volatile token. A draw not returned in time is slashed to the vault. Losing a race to another keeper is not slashed: the draw goes back.

## How is this different from a DEX liquidation?

| | DEX swap liquidation | Funded quote settlement |
| --- | --- | --- |
| Who buys the collateral | Whoever is in the pool at that moment | Buyers who committed in advance, Nectar Reserve last |
| Price | Whatever the pool gives for that size | The oracle-referenced price in each quote |
| Depth | Uncommitted; can thin out in a crash | Committed; USDC already in escrow |
| After the liquidation | Liquidator must sell immediately | Buyer holds the collateral |
| Best for | Assets with deep, reliable pools | Assets whose collateral outgrows their pools |

Nectar doesn't replace DEX liquidations. When a DEX or prop AMM can absorb the position, Nectar Route sends it there. Committed quotes are for the case where it can't.

## What does a buyer need to know before quoting?

A buyer is agreeing to own the collateral, not to flip it. That means taking on whatever risk the collateral carries for as long as they hold it, including, for assets that redeem later, the risk that the underlying doesn't hold its value until redemption.

A quote is also only useful if it's there when needed. That's why withdrawing committed size takes a notice period: a bid that could be pulled the moment prices fall isn't much of a commitment, and a lending market couldn't count it when it sets a limit. In return, buyers earn a [commitment fee](/learn/glossary#commitment-fee) on the size they commit, funded by the [rate premium](/learn/glossary#rate-premium) borrowers pay for limits above a static ratio. [How committed quotes, notice periods and commitment fees work](/learn/committed-quotes-notice-periods-and-commitment-fees) covers this in detail.

## When will funded quotes be available?

Not yet. Pappus, Macaulay and the products built on them are in development, and the core contracts are in audit. A small pilot cohort of buyers, lenders and apps comes first. If you'd like to quote as a buyer, or have committed quotes back the limits in a market you run, [talk to us](/contact). The [docs](https://docs.nectar.monster) cover the design in more detail.
