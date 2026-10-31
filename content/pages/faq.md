---
title: Frequently asked questions
metaTitle: "Nectar Network FAQ: pilot, risk and status"
crumb: FAQ
description: "Answers about Nectar Network: what it is, whether it's available yet, who it's for, who carries the risk, its audit and licence, and how to join the pilot cohort."
type: faq
status: draft
eyebrow: FAQ
updated: 2026-10-31
related:
  - /how-it-works
  - /learn/what-is-exit-capacity
  - /about
---

## What is Nectar Network?

Nectar Network is exit infrastructure for lending markets: it lines up funded buyers for collateral so liquidations can clear when DEX liquidity can't absorb them. Buyers post funded quotes held in USDC escrow, and when a DEX is too thin, a liquidation settles against a quote in one transaction. [How it works](/how-it-works) covers the full flow.

## Is it live?

No. Nectar Network is in development, and nothing on this site is available to use yet. A small pilot cohort of curators, lending protocols and buyers comes first, before anything opens to the public.

## Who is it for?

Curators and lending protocols who want committed exit capacity for the collateral they list, so they can size caps against it. Buyers who want to buy collateral at a known price through funded quotes. And automation apps and lenders who need an exit when a pool runs dry.

## Who carries the risk?

Pappus, Nectar's settlement protocol, only settles and holds escrow. Pricing risk sits with buyers, who choose the price and size of each quote, and listing risk sits with curators, who decide which collateral their markets accept. Keepers bond USDC, and a draw not returned in time is slashed to the vault.

## Is it audited?

The core contracts are in audit. The report will be published on this site when the audit closes.

## Is it open source?

Yes. Every contract and the keeper daemon are public under the MIT license on [GitHub](https://github.com/Nectar-Network/nectar).

## How do I join the pilot?

Fill in the [Talk to us](/contact) form, or email kunal@nectarnetwork.fun. We reply by email to set up a short call, and for curators and protocols the next step is a depth study of the markets you named.

## What is a funded quote?

A funded quote is a standing bid to buy a collateral asset at a set price, backed by USDC held in escrow. One dollar backs one active quote, and the buyer receives collateral only when a position closes against it. [How a funded quote settles a liquidation](/learn/funded-quote-settlement) explains the steps.

## Which collateral does Nectar focus on?

Collateral whose exit is small compared with how much of it is borrowed against: wrapped BTC, principal tokens, tokenized stocks, credit and RWA tokens, and liquid staking and restaking tokens. Nectar is built once per collateral class and shipped wherever that class is listed. Your collateral isn't listed? [Talk to us](/contact).
