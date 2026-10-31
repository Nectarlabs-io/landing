---
title: What is an exit-backed borrowing limit?
metaTitle: What is an exit-backed borrowing limit?
crumb: Exit-backed borrowing limits
description: "An exit-backed borrowing limit is the lower of the oracle limit and recoverable value: what committed buyers and verified DEX depth could pay, less a haircut."
type: article
status: draft
eyebrow: LEARN
updated: 2026-10-31
related:
  - /learn/committed-quotes-notice-periods-and-commitment-fees
  - /how-it-works
  - /learn/glossary
---

An exit-backed borrowing limit caps how much can be borrowed against a collateral asset at the lower of two numbers: the usual oracle limit, and the asset's recoverable value. Recoverable value is what committed buyers' quotes, a house buyer's quotes and verified DEX depth could pay for the collateral now, minus a haircut. The more buyers commit, the higher the limit can go, up to the oracle limit and never past it.

It turns the question a lender always asks, "could we sell this if we had to?", into the number that sets the limit.

## How do lending markets set limits today?

Most lending markets set a static limit for each collateral asset: a loan-to-value ratio applied to the asset's oracle price. If the ratio is 60% and a borrower posts collateral worth $10M at the oracle price, they can borrow up to $6M. A separate, higher threshold (the [LLTV](/learn/glossary#lltv) on Morpho) decides when a position can be liquidated.

The ratio is chosen to survive a bad day. Lenders and curators look at how volatile the asset is, how deep its pools are, and how quickly it could be sold, then pick a number low enough that liquidations should clear even when prices fall fast.

## Why is a static limit a poor fit for tokenized assets?

For many tokenized assets, the thing that decides whether a loan is safe isn't the price. It's whether anyone will buy the collateral when the loan has to close.

A wrapped BTC token can have hundreds of millions borrowed against it and a small fraction of that in DEX pools. A [principal token](/learn/principal-token-collateral) often exits through one thin pool until maturity. Tokenized real-world assets can stop trading outside market hours, or pause at the issuer. In each case, the oracle price can be right and the collateral still can't be sold for it in the minutes a liquidation needs.

A static ratio can't see that. So the safe choice is a low ratio and a low [supply cap](/learn/glossary#supply-cap), for every borrower, all the time. Unsold collateral becomes [bad debt](/learn/bad-debt-in-lending-markets), so lenders keep limits low and markets for tokenized assets stay small.

## How is an exit-backed limit calculated?

```
limit = min( oracle LTV × value,
             (1 − haircut) × (committed quotes + Reserve quotes + DEX depth) )
```

The first term is the limit a market would set anyway. The second is the asset's [recoverable value](/learn/glossary#recoverable-value) after a [haircut](/learn/glossary#haircut):

- **Committed quotes** are funded bids from buyers, held in USDC escrow, whose size is committed for a [notice period](/learn/glossary#notice-period).
- **Reserve quotes** come from Nectar Reserve, the house [prop AMM](/learn/glossary#prop-amm), which quotes covered collateral and fills last.
- **DEX depth** is what pools can verifiably absorb, measured rather than assumed.
- **The haircut** allows for prices moving while a position closes.

Taking the lower of the two numbers means the exit can raise a limit only up to the oracle limit, and a thin exit always pulls it down.

## What does that look like with numbers?

Here is an illustrative example. The numbers are made up to show the mechanism, not measured from any market.

| | Amount |
| --- | --- |
| Collateral, at the oracle price | $10.0M |
| Static limit at 60% LTV | $6.0M |
| Oracle limit at 80% LTV | $8.0M |
| Committed quotes | $5.0M |
| Nectar Reserve quotes | $1.5M |
| Verified DEX depth | $2.0M |
| Recoverable value | $8.5M |
| Recoverable value after a 10% haircut | $7.65M |
| **Exit-backed limit: the lower of $8.0M and $7.65M** | **$7.65M** |

The borrower can borrow $7.65M instead of $6.0M: $1.65M more than the static limit. And every dollar of that limit is backed by a buyer who has already put up the money, or by depth that has been checked.

## Who pays for the higher limit?

The borrower does. Borrowing above the static limit carries a [rate premium](/learn/glossary#rate-premium): extra interest on the part of the loan above the static ratio. In the example, the premium applies to the extra $1.65M, not to the whole loan.

The premium funds the [commitment fees](/learn/glossary#commitment-fee) buyers earn for keeping their size committed. That's the trade at the centre of the design: borrowers pay for room, and buyers are paid to stand behind it. [How committed quotes, notice periods and commitment fees work](/learn/committed-quotes-notice-periods-and-commitment-fees) covers the buyer's side.

## Why does the limit count committed quotes and not just bids?

Because a bid that can vanish when prices fall is no use to a lender. A committed quote separates price from size. The buyer can reprice cheaply, since the price is referenced to an oracle. But the size can't be pulled before the notice period ends.

That is what makes the quote countable. A lending market can set a limit against size it knows will still be there when it's needed, rather than against size that might leave in the first minute of a fall.

## What happens when buyers leave?

When buyers give notice and committed size falls, recoverable value falls with it, and so does the limit. The design handles that in order:

1. **New borrowing shrinks first.** Borrowers can't open new debt above the lower limit.
2. **Existing loans deleverage through the remaining quotes.** A loan above the new limit is brought back down by settling part of it against the quotes still committed, instead of being liquidated all at once.

The aim is a slope, not a cliff. A static limit has no warning: a position is fine until the moment it's liquidated. An exit-backed limit moves as committed size moves, and the notice period gives the market time to adjust.

## What doesn't an exit-backed limit do?

It doesn't remove risk. Buyers can misprice their quotes, prices can gap further than any haircut, and verified depth can still thin out. The design narrows those risks rather than hiding them:

- The limit never exceeds the oracle limit, however many buyers commit.
- Nectar Reserve is one buyer among many, never the only bid a limit counts on.
- Lending markets, escrow and settlement are separate, minimal contracts, so a fault in one doesn't spread to the others.
- Buyers carry pricing risk on their own quotes.

## Where does Nectar Network fit?

Nectar Network is credit and liquidity for tokenized assets: lending markets whose borrowing limits are backed by committed buyers, so loans can go further and positions still close when DEX liquidity can't absorb them.

Exit-backed lending markets are in design, and so is the engine that prices collateral for Nectar Reserve. Pappus, the settlement and escrow protocol that committed quotes settle through, and Nectar Feed, which publishes committed capacity per asset and market, are in development. Nothing is available to use yet. How large haircuts should be, how long notice periods run and how bids get counted are rules the pilot cohort helps set.

If you run an app whose borrowers want higher limits on tokenized assets, lend or curate a market, or want to be paid to stand behind loans as a buyer, [talk to us](/contact) about the pilot.
