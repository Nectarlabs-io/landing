---
title: "Glossary: liquidation and collateral terms"
metaTitle: Glossary of liquidation and collateral terms
crumb: Glossary
description: "Plain definitions of the lending-market terms used across Nectar Network: LLTV, liquidation bonus, supply cap, curator, keeper, funded quote, exit gap and more."
type: glossary
status: draft
eyebrow: GLOSSARY
updated: 2026-10-31
related:
  - /learn/what-is-exit-capacity
  - /learn/funded-quote-settlement
  - /faq
---

Plain definitions of the terms used across this site, in the order a liquidation meets them.

## LLTV

LLTV (liquidation loan-to-value) is the loan-to-value ratio at which a position in a lending market can be liquidated. Morpho uses the term; other protocols call it the liquidation threshold. A market with an 86% LLTV, such as cirBTC/USDC on Morpho, lets a position borrow until its debt reaches 86% of its collateral's value before it can be liquidated.

## Liquidation bonus

A liquidation bonus is the discount a liquidator receives on collateral when it repays a liquidatable position's debt. It pays liquidators to act quickly and to cover the cost of selling the collateral. If selling the collateral would lose more than the bonus, liquidators have no reason to step in.

## Supply cap

A supply cap is the most of an asset a lending market will accept as collateral in total. Curators and risk teams set it so that a crash can't force more of the asset onto the market than can be sold. When a cap fills, no one else can deposit that collateral until the cap is raised. See [why DEX depth limits collateral caps](/learn/dex-depth-and-collateral-caps).

## Curator

A curator decides which collateral a lending market or vault accepts and on what terms: LLTVs, supply caps and how much to allocate. Curators carry listing risk, which is why they keep caps low on collateral they can't see a reliable exit for.

## Keeper

A keeper is an operator that watches positions in a lending market and acts when one becomes liquidatable. Nectar Keepers are designed to be bonded in USDC and to route each liquidation to an exit that can absorb it. A draw not returned in time is slashed to the vault, and losing a race to another keeper is not.

## Funded quote

A funded quote is a standing bid to buy a collateral asset at a set price, backed by USDC held in escrow. It has a size cap and an expiry, can allow partial fills, and can be cancelled with notice. See [how a funded quote settles a liquidation](/learn/funded-quote-settlement).

## Escrow

Escrow is where a buyer's USDC sits while their funded quote is active. In Nectar's design, Pappus holds it, one dollar backs one active quote, and the funds stay the buyer's until a position closes against the quote or the buyer cancels.

## Exit gap

An exit gap is the part of a market's collateral that DEX depth cannot absorb: collateral at stake minus DEX depth. On Oct 25, 2026, the cirBTC/USDC market on Morpho had an exit gap of about $250.1M ($274.0M of collateral against about $23.9M of DEX liquidity). See [the case study](/research/cirbtc-collateral-vs-dex-depth).

## Committed capacity

Committed capacity is collateral that buyers have agreed in advance to take, backed by funds already in escrow. Unlike DEX depth, it doesn't disappear when pools thin out. Nectar Feed is designed to publish it per asset and market, readable onchain, so curators can size caps against it.

## Redemption queue

A redemption queue is the wait between asking an issuer to redeem a token and receiving the underlying asset. Credit and RWA tokens often have one, and staking tokens have withdrawal queues. A queue sets a floor on a token's value, but it can't repay a loan in the minutes a liquidation needs.
