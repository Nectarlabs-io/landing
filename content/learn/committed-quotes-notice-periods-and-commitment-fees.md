---
title: How committed quotes, notice periods and commitment fees work
metaTitle: How committed quotes and commitment fees work
crumb: Committed quotes and fees
description: "Committed quotes are funded bids whose size stays for a notice period. Buyers earn commitment fees on that size, paid by the rate premium on higher borrowing limits."
type: article
status: draft
eyebrow: LEARN
updated: 2026-10-31
related:
  - /learn/what-is-an-exit-backed-borrowing-limit
  - /learn/funded-quote-settlement
  - /learn/glossary
---

A committed quote is a funded bid for a collateral asset whose price can move but whose size can't leave in a hurry. The price is referenced to an oracle, so the buyer can reprice it cheaply. The size is committed for a notice period, so a lending market can count it when it sets a borrowing limit. Buyers earn a commitment fee on the size they commit, paid from the rate premium borrowers pay for limits above a static ratio.

Those three pieces, the quote, the notice period and the fee, are what let a buyer stand behind loans and be paid for it.

## What is a committed quote?

A committed quote is a standing offer to buy a specific collateral asset, with the money already set aside. It has a few parts:

| Part | What it means |
| --- | --- |
| Price | Referenced to an oracle price; the buyer chooses where to sit against it and can reprice cheaply |
| Size | The most collateral the quote will take |
| Escrow | The USDC behind the quote; one dollar backs one active quote |
| Notice period | How long the size stays committed after the buyer gives notice to withdraw it |
| Partial fills | Whether the quote can be filled in pieces |

The USDC sits in escrow, held by Pappus, Nectar's settlement and escrow protocol. Because each dollar backs one active quote, a quote can never promise more than it holds, and the same dollar can't be counted twice. The funds stay the buyer's until a position closes against the quote, or the buyer withdraws after the notice period.

## Why separate the price from the size?

Because they protect different people.

The price protects the buyer. Markets move, and a buyer who had to hold a fixed price for weeks would either quote far below the market to stay safe or not quote at all. Referencing the price to an oracle, and making repricing cheap, lets a buyer keep a quote close to where they actually want to buy.

The size protects the lender. A lending market setting a limit needs to know how much collateral buyers will take when it matters, not just today. If size could be withdrawn instantly, every quote would disappear at the first sign of trouble, and a limit counted against it would be worthless. Committing the size, and only the size, gives the market something it can rely on without asking buyers to freeze their price.

## What is a notice period?

A [notice period](/learn/glossary#notice-period) is how long a buyer's committed size stays in place after the buyer asks to withdraw it. The buyer gives notice, the clock runs, and only then can the size leave.

That window does two things. It means a fall in prices can't empty the quotes behind a market in minutes. And it gives the market time to adjust: as soon as notice is given, the [borrowing limit](/learn/what-is-an-exit-backed-borrowing-limit) can start to come down, new borrowing shrinks first, and existing loans can deleverage through the quotes that remain rather than hitting a liquidation cliff.

How long notice periods should run is one of the rules the pilot cohort helps set. Longer notice makes size more dependable; shorter notice makes quoting less of a commitment for buyers.

## How does a committed quote get filled?

Only when a position has to close and the pool behind it is too thin.

When a position becomes liquidatable, a keeper flags it and Nectar Route checks whether a DEX or prop AMM can absorb it. If one can, the position is filled there. If the pool is too thin, Pappus settles the position against committed quotes in one transaction: buyers' escrowed USDC repays the debt to the lending market, and the buyers receive the collateral. Nectar Reserve, the house prop AMM, fills last. [How a funded quote settles a liquidation](/learn/funded-quote-settlement) walks through the steps.

Because repayment and delivery happen in the same transaction, a buyer never ends up paying without receiving the collateral, and the market never hands over collateral without its debt being repaid.

## What is a commitment fee?

A [commitment fee](/learn/glossary#commitment-fee) is what a buyer earns for keeping size committed behind a market. It is paid for standing ready, whether or not a position ever closes against the quote.

That matters, because most of the time nothing goes wrong. A buyer who earned only when they received collateral would be paid rarely and unpredictably, and mostly on the worst days. A fee on committed size pays for the thing the market actually uses every day: the assurance that the buyer is there.

## Where does the money for commitment fees come from?

From borrowers, through a [rate premium](/learn/glossary#rate-premium). Borrowing above a market's static limit carries extra interest on the part of the loan above that limit. The borrower pays for the extra room, and the premium funds the commitment fees of the buyers whose quotes make the extra room possible.

In the illustrative example in [what is an exit-backed borrowing limit?](/learn/what-is-an-exit-backed-borrowing-limit), committed quotes and depth let a borrower take $7.65M against $10.0M of collateral instead of $6.0M. The premium applies to the extra $1.65M, not to the whole loan. Those numbers are made up to show the mechanism; fee and premium levels are set per market.

## What does a buyer risk?

A buyer is agreeing to own the collateral, not to flip it.

- **Pricing risk.** If a buyer's quote turns out to be above what the collateral is worth, the buyer carries the difference. That's why buyers set their own price against the oracle.
- **Holding risk.** After a fill, the buyer holds whatever risk the collateral carries for as long as they keep it.
- **Commitment.** For the length of the notice period, committed size can't be redeployed elsewhere. The commitment fee is the payment for that.

For collateral that redeems later, such as principal tokens and queued credit tokens, Macaulay, Nectar's pricing protocol, is designed to let buyers quote against redemption value and the time to it, and to hold to settlement instead of selling into the pool that caused the fall.

## How does Nectar Reserve fit in?

Nectar Reserve is designed as Nectar's house [prop AMM](/learn/glossary#prop-amm): it quotes covered collateral and is the buyer of last resort. In settlement it fills last, after committed quotes from other buyers.

It is one buyer among many, never the only one. A borrowing limit is never allowed to rest on Nectar Reserve alone, so the limits in a market always depend on committed size from buyers other than the house.

## Who decides the rules?

The rules that matter most to buyers and lenders are being set with the pilot cohort: how large haircuts should be, how long notice periods run, and how bids get counted toward a limit. Prop AMMs, market makers and funds that join as buyers help set them.

Every part of this is in development, and nothing is available to use yet. If you'd like to be paid to stand behind loans, [talk to us](/contact) about joining the pilot as a buyer.
