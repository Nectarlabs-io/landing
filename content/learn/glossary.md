---
title: "Glossary: borrowing limit and liquidation terms"
metaTitle: Glossary of borrowing limits and liquidations
crumb: Glossary
description: "Plain definitions of the lending terms used across Nectar Network: recoverable value, haircut, notice period, commitment fee, LLTV, funded quote and more."
type: glossary
status: draft
eyebrow: GLOSSARY
updated: 2026-10-31
related:
  - /learn/what-is-an-exit-backed-borrowing-limit
  - /learn/committed-quotes-notice-periods-and-commitment-fees
  - /faq
---

Plain definitions of the terms used across this site: first how a borrowing limit is set, then what happens when a position has to close.

## Borrowing limit

A borrowing limit is the most a borrower can borrow against a collateral asset in a lending market. Most markets set it as a static ratio of the collateral's oracle value. Nectar's design sets it as the lower of the usual oracle limit and the asset's recoverable value. See [what is an exit-backed borrowing limit?](/learn/what-is-an-exit-backed-borrowing-limit)

## Recoverable value

Recoverable value is what a collateral asset could actually be sold for if it had to be sold now: committed buyers' quotes, Nectar Reserve's quotes and verified DEX depth, minus a haircut. It is the second number in an exit-backed limit, and it rises as more buyers commit.

## Haircut

A haircut is the share taken off recoverable value before it counts toward a limit, to allow for prices moving while a position closes. With a 10% haircut, $8.5M of recoverable value counts as $7.65M. How large haircuts should be is one of the rules pilot partners help set.

## Notice period

A notice period is how long a buyer's committed size stays in place after the buyer gives notice to withdraw it. Buyers can reprice a quote cheaply, but can't pull its size before the notice period ends, so a lending market can count the quote when it sets a limit.

## Commitment fee

A commitment fee is what a buyer earns for keeping size committed behind a market. It is paid for standing ready, whether or not a position ever closes against the quote, and it is funded by the rate premium borrowers pay for limits above a static ratio.

## Rate premium

A rate premium is the extra interest a borrower pays on the part of a loan above a static limit. It is the price of the higher limit, and it funds the commitment fees that keep buyers' size in place.

## Prop AMM

A prop AMM (proprietary automated market maker) is a market maker that quotes from its own capital and pricing, rather than from a public pool anyone can add liquidity to. Nectar Reserve is designed as Nectar's house prop AMM: it quotes covered collateral and is the buyer of last resort, never the only bid a limit counts on.

## LLTV

LLTV (liquidation loan-to-value) is the loan-to-value ratio at which a position in a lending market can be liquidated. Morpho uses the term; other protocols call it the liquidation threshold. A market with an 86% LLTV, such as cirBTC/USDC on Morpho, lets a position borrow until its debt reaches 86% of its collateral's value before it can be liquidated.

## Liquidation bonus

A liquidation bonus is the discount a liquidator receives on collateral when it repays a liquidatable position's debt. It pays liquidators to act quickly and to cover the cost of selling the collateral. If selling the collateral would lose more than the bonus, liquidators have no reason to step in.

## Supply cap

A supply cap is the most of an asset a lending market will accept as collateral in total. Curators and risk teams set it so that a crash can't force more of the asset onto the market than can be sold. When a cap fills, no one else can deposit that collateral until the cap is raised. See [why DEX depth limits collateral caps](/learn/dex-depth-and-collateral-caps).

## Curator

A curator decides which collateral a lending market or vault accepts and on what terms: LLTVs, supply caps and how much to allocate. Curators carry listing risk, which is why they keep caps low on collateral they can't see a reliable exit for.

## Keeper

A keeper is an operator that watches positions in a lending market and acts when one becomes liquidatable. Nectar Keepers are designed to be bonded in USDC and to route each position to an exit that can absorb it. A draw not returned in time is slashed to the vault, and losing a race to another keeper is not.

## Funded quote

A funded quote is a standing bid to buy a collateral asset at an oracle-referenced price, backed by USDC held in escrow. Its size is committed for a notice period, and it can allow partial fills. See [how a funded quote settles a liquidation](/learn/funded-quote-settlement).

## Escrow

Escrow is where a buyer's USDC sits while their funded quote is active. In Nectar's design, Pappus holds it, one dollar backs one active quote, and the funds stay the buyer's until a position closes against the quote or the buyer withdraws after the notice period.

## Exit gap

An exit gap is the part of a market's collateral that DEX depth cannot absorb: collateral at stake minus DEX depth. On Oct 25, 2026, the cirBTC/USDC market on Morpho had an exit gap of about $250.1M ($274.0M of collateral against about $23.9M of DEX liquidity). See [the case study](/research/cirbtc-collateral-vs-dex-depth).

## Committed capacity

Committed capacity is collateral that buyers have agreed in advance to take, backed by funds already in escrow and committed for a notice period. Unlike DEX depth, it doesn't disappear when pools thin out. Nectar Feed is designed to publish it per asset and market, readable onchain, and each borrowing limit is set from it.

## Redemption queue

A redemption queue is the wait between asking an issuer to redeem a token and receiving the underlying asset. Credit and real-world asset tokens often have one, and staking tokens have withdrawal queues. A queue sets a floor on a token's value, but it can't repay a loan in the minutes a liquidation needs.
