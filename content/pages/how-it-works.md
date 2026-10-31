---
title: How Nectar Network closes a liquidation
metaTitle: How Nectar Network closes liquidations
crumb: How it works
description: "Nectar Network routes each liquidation to the exit that can absorb it: a DEX swap when depth allows, or a funded quote settled in one transaction when it doesn't."
type: article
status: draft
eyebrow: HOW IT WORKS
updated: 2026-10-31
related:
  - /learn/funded-quote-settlement
  - /learn/what-is-exit-capacity
  - /faq
---

Nectar Network is designed to close each liquidation through whichever route can absorb it. Keepers flag the position, a router checks DEX depth, and if the pool is too thin the position settles against a buyer's funded quote in one transaction. Every part of this flow is in development, and pilot partners see it first.

## What happens when a position becomes liquidatable?

A borrower's position in a lending market becomes liquidatable when its loan-to-value crosses the market's [LLTV](/learn/glossary#lltv). From there, Nectar's flow has six steps:

1. **Lending markets.** A position on a market such as Morpho, Aave V4 or Blend is at risk.
2. **Nectar Keepers flag it.** Bonded operators watch every position in the markets they serve.
3. **Nectar Route checks DEX depth.** It asks one question: can a DEX absorb this sale without the price collapsing?
4. **Deep enough: DEX swap.** The position is liquidated and the collateral sold in one transaction.
5. **Too thin: Pappus settles from a funded quote.** The debt is repaid to the lending market with the buyer's USDC, and the buyer receives the collateral.
6. **Nectar Feed publishes committed capacity.** Curators read it to size their caps.

The point of the second route is simple: a liquidation should not depend on a pool that is too small for it. When the DEX can't absorb the sale, a buyer who has already committed funds can.

## What does each component do?

| Component | What it does | Status |
| --- | --- | --- |
| Nectar Keepers | Bonded operators that watch positions and trigger routes | In development |
| Nectar Route | Checks DEX depth and sends each liquidation to an exit that can absorb it | In development |
| Pappus | Settlement and quote escrow: repays debt with the buyer's USDC and delivers the collateral in one transaction | In development |
| Macaulay | Prices collateral that redeems later against its redemption value and time to redemption | In development |
| Nectar Feed | Publishes committed exit capacity per asset and market, readable onchain | In development |
| Nectar Reserve | The house buyer vault: one buyer among many, never the only one | In development |
| Nectar Exits | Cash for lenders in fully borrowed markets, instead of waiting for repayments | In development |
| Launch Cover | 90 days of keepers plus a house bid for a new market | In development |

Pappus and Macaulay are the two protocols underneath. Everything else is a product built on them.

## How does a funded quote work?

A funded quote is a standing bid for a collateral asset, backed by USDC held in escrow. A buyer posts it once, with a price, a maximum size and an expiry, and can allow partial fills. Each dollar in escrow backs one active quote, so a quote can never promise more than it holds.

The buyer receives collateral only when a position closes against the quote. Until then the USDC stays in escrow, and the buyer can cancel with notice. [How a funded quote settles a liquidation](/learn/funded-quote-settlement) walks through the settlement step by step.

## Who carries which risk?

Nectar's core is deliberately thin, so each risk sits with the party best placed to price it.

| Party | Risk it carries |
| --- | --- |
| Pappus | None of the pricing or listing risk: it only settles and holds escrow |
| Buyers | Pricing risk: they choose the price and size of each quote |
| Curators | Listing risk: they decide which collateral their markets accept and at what caps |
| Keepers | Their own bond: a draw not returned in time is slashed to the vault |

Keepers bond USDC, never a volatile token, so a slash is worth what it says. Losing a race to another keeper is not slashed: the draw goes back and the keeper pays only its transaction fee.

For collateral that redeems later, Macaulay lists only underlyings a curator already accepts, with exposure capped per issuer.

## What does Nectar Feed publish?

Nectar Feed is designed to publish committed exit capacity for each asset and market: how much collateral buyers have committed to take, backed by escrowed funds. Because it is readable onchain, a risk manager can size a supply cap against it instead of against an estimate of DEX depth on a calm day.

How committed bids get counted is one of the rules pilot partners help set. [What is exit capacity?](/learn/what-is-exit-capacity) explains why the number matters.

## Which collateral is this built for?

Nectar is built once per collateral class and shipped wherever that class is listed. The classes where the exit problem is sharpest:

| Collateral class | Where it's borrowed against | Exit problem |
| --- | --- | --- |
| Wrapped BTC | Morpho (cirBTC) | DEX depth far below collateral |
| Principal tokens | Morpho, Aave, Euler | One thin Pendle pool until maturity |
| Tokenized stocks | Aave V4 Equities Hub, Morpho, Kamino | Weekend price gaps, issuer pauses |
| Credit and RWA tokens | Aave V4, Morpho, Blend | Redemption queues, sometimes cross-chain |
| LSTs and LRTs | Aave, Morpho, Lido Lend | Withdrawal queues |

## What isn't built yet?

None of this is available to use today. Every component on this page is in development, and the core contracts are in audit, with the report to be published when it closes. A small pilot cohort of curators, lending protocols and buyers comes first, before anything opens to the public.

Every contract and the keeper daemon are public under the MIT license on [GitHub](https://github.com/Nectar-Network/nectar), and the [docs](https://docs.nectar.monster) cover the design in more detail.
