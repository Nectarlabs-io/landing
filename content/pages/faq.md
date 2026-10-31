---
title: Frequently asked questions
metaTitle: "Nectar Network FAQ: limits, risk and status"
crumb: FAQ
description: "Answers about Nectar Network: what it is, how borrowing limits are set, who pays, who carries the risk, whether it's available yet, and how to join the pilot cohort."
type: faq
status: draft
eyebrow: FAQ
updated: 2026-10-31
related:
  - /how-it-works
  - /learn/what-is-an-exit-backed-borrowing-limit
  - /about
---

## What is Nectar Network?

Nectar Network is credit and liquidity for tokenized assets: lending markets whose borrowing limits are backed by committed buyers, so loans can go further and positions still close when DEX liquidity can't absorb them. Buyers post funded quotes in USDC escrow, and lending markets count those quotes when they set limits. [How it works](/how-it-works) covers the full flow.

## Is it live?

No. Nectar Network is in development, and nothing on this site is available to use yet. A small pilot cohort of buyers, lenders and apps comes first, before anything opens to the public.

## How are borrowing limits set?

Each limit is the lower of the usual oracle limit and the asset's recoverable value: committed buyers' quotes, Nectar Reserve's quotes and verified DEX depth, minus a haircut. More committed buyers mean a higher limit, but never one above the oracle limit. [What is an exit-backed borrowing limit?](/learn/what-is-an-exit-backed-borrowing-limit) works through an example.

## Who pays?

Borrowers pay a rate premium for a limit above a static ratio. That premium funds the commitment fees buyers earn for keeping their size committed behind the market.

## Who carries the risk?

Buyers carry pricing risk on their own quotes, since they choose the price and the size they commit. Lending markets, escrow and settlement are separate, minimal contracts, so a fault in one doesn't spread to the others. Nectar Reserve is never the only bid a limit counts on.

## Who is it for?

Borrowers, through the apps, brokers and agents they use, who want higher limits on tokenized assets. Buyers, such as prop AMMs, market makers and funds, who want to be paid to stand behind loans. And lenders, curators and lending protocols who want to lend more against collateral that has committed buyers.

## What happens if buyers withdraw?

Buyers can give notice to withdraw committed size, but can't pull it before their notice period ends. As committed size falls, recoverable value and the limit fall with it, and new borrowing shrinks first. Existing loans deleverage through the remaining quotes instead of hitting a liquidation cliff.

## What is a funded quote?

A funded quote is a standing bid to buy a collateral asset at an oracle-referenced price, backed by USDC held in escrow. One dollar backs one active quote, and the buyer receives collateral only when a position closes against it. [How a funded quote settles a liquidation](/learn/funded-quote-settlement) explains the steps.

## Is it audited?

The core contracts are in audit. The report will be published on this site when the audit closes.

## Is it open source?

Yes. Every contract and the keeper daemon are public under the MIT license on [GitHub](https://github.com/Nectar-Network/nectar).

## Which collateral does Nectar focus on?

Tokenized assets whose exit is small compared with how much is borrowed against them: wrapped BTC, principal tokens, tokenized real-world assets, and liquid staking and restaking tokens. Nectar is built once per collateral class and shipped wherever that class is listed. Your collateral isn't listed? [Talk to us](/contact).

## How do I join the pilot?

Fill in the [Talk to us](/contact) form, or email kunal@nectarnetwork.fun. We reply by email to set up a short call, and for lenders, curators and apps the next step is a depth study of the assets you named.
