---
title: How Nectar Network backs borrowing limits and closes positions
metaTitle: How Nectar Network borrowing limits work
crumb: How it works
description: "Buyers commit funded quotes, lending markets set limits from recoverable value, and positions close through a DEX, a prop AMM or settlement against committed quotes."
type: article
status: draft
eyebrow: HOW IT WORKS
updated: 2026-10-31
related:
  - /learn/what-is-an-exit-backed-borrowing-limit
  - /learn/committed-quotes-notice-periods-and-commitment-fees
  - /learn/funded-quote-settlement
  - /faq
---

Nectar Network backs borrowing limits with committed buyers. Buyers post funded quotes in escrow before anything goes wrong; lending markets set each limit from the value those quotes and verified DEX depth can recover; and when a position goes bad, it closes through whichever route can absorb it. Every part of this flow is in development, and pilot partners see it first.

## What happens, step by step?

The flow has six steps. The first two happen on a calm day, long before any position is at risk.

1. **Buyers commit quotes.** Buyers post funded quotes for a collateral asset: an oracle-referenced price and a size, backed by USDC in escrow and committed for a [notice period](/learn/glossary#notice-period). Nectar Reserve, the house prop AMM, quotes too.
2. **Limits are set from recoverable value.** A lending market caps borrowing against the asset at the lower of its usual oracle limit and the asset's [recoverable value](/learn/glossary#recoverable-value): committed quotes, Reserve quotes and verified DEX depth, minus a [haircut](/learn/glossary#haircut).
3. **Keepers watch.** Nectar Keepers, bonded operators, watch every position in the markets they serve and flag one when it becomes liquidatable.
4. **Nectar Route checks depth.** It asks one question: can a DEX or prop AMM absorb this position without the price collapsing?
5. **The position closes.** If the pool is deep enough, the position is liquidated and filled there in one transaction. If it's too thin, Pappus settles it against committed quotes in one transaction, with Nectar Reserve filling last: the debt is repaid to the market with the buyers' USDC, and the buyers receive the collateral.
6. **Nectar Feed publishes committed capacity.** How much buyers have committed per asset and market, readable onchain, which is what each borrowing limit is set from.

The point of the second route is simple: a loan should not depend on a pool that is too small for it. When the DEX can't absorb the sale, buyers who have already committed funds can.

## How is a borrowing limit set?

Each limit is the lower of two numbers:

```
limit = min( oracle LTV × value,
             (1 − haircut) × (committed quotes + Reserve quotes + DEX depth) )
```

The first number is the limit a market would set anyway. The second is what the collateral could actually be sold for if it had to be sold now. More committed buyers mean a higher second number, so the limit can rise above what a static ratio would allow, but never above the oracle limit. [What is an exit-backed borrowing limit?](/learn/what-is-an-exit-backed-borrowing-limit) works through an example.

Borrowing above a static limit carries a [rate premium](/learn/glossary#rate-premium), and the premium pays buyers a [commitment fee](/learn/glossary#commitment-fee) for the size they keep committed.

## What does each component do?

| Component | What it does | Status |
| --- | --- | --- |
| Pappus | Settlement and quote escrow: repays debt with buyers' USDC and delivers the collateral in one transaction | In development |
| Macaulay | Prices collateral that redeems later against its redemption value and time to redemption | In development |
| Exit-backed lending markets | Cap borrowing at recoverable value and charge a premium for the extra limit; lenders deposit through Nectar-curated vaults | In design |
| Reserve quoting engine | Prices the collateral Nectar lends against, so Nectar Reserve can quote it | In design |
| Nectar Keepers | Bonded operators that watch positions and trigger routes | In development |
| Nectar Route | Checks DEX and prop AMM depth and sends each position to an exit that can absorb it | In development |
| Nectar Feed | Publishes committed exit capacity per asset and market, readable onchain | In development |
| Nectar Reserve | The house prop AMM: quotes covered collateral and is the buyer of last resort | In development |
| Nectar Exits | Cash for lenders in fully borrowed markets, instead of waiting for repayments | In development |
| Launch Cover | 90 days of keepers plus a house bid for a new market | In development |

## What do committed quotes promise?

A committed quote is a funded bid with two parts that behave differently. The price is referenced to an oracle and a buyer can reprice it cheaply. The size is committed for a notice period: a buyer can give notice to withdraw it, but can't pull it before the notice period ends. That is what lets a lending market count the quote when it sets a limit.

Each dollar in escrow backs one active quote, so a quote can never promise more than it holds. [How committed quotes, notice periods and commitment fees work](/learn/committed-quotes-notice-periods-and-commitment-fees) covers the details, and [how a funded quote settles a position](/learn/funded-quote-settlement) walks through the settlement itself.

## What happens when quotes leave?

When buyers give notice and committed size falls, recoverable value falls with it, and so does the limit. New borrowing shrinks first. Existing loans above the new limit deleverage through the quotes that remain, instead of hitting a liquidation cliff all at once.

## Who carries which risk?

Nectar's core is deliberately thin, so each risk sits with the party best placed to price it.

| Party | Risk it carries |
| --- | --- |
| Buyers | Pricing risk on their own quotes: they choose the price and the size they commit |
| Lending markets, escrow and settlement | Kept apart: they are separate, minimal contracts, so a fault in one doesn't spread to the others |
| Nectar Reserve | One bid among the committed quotes, never the only bid a limit counts on |
| Lenders and curators | Which collateral their markets accept, and on what terms |
| Keepers | Their own bond: a draw not returned in time is slashed to the vault |

Keepers bond USDC, never a volatile token, so a slash is worth what it says. Losing a race to another keeper is not slashed: the draw goes back and the keeper pays only its transaction fee.

## Which collateral is this built for?

Nectar is built once per collateral class and shipped wherever that class is listed. The classes where the exit problem is sharpest:

| Collateral class | Where it's borrowed against | Exit problem |
| --- | --- | --- |
| Wrapped BTC | Morpho (cirBTC) | DEX depth far below collateral |
| Principal tokens | Morpho, Aave, Euler | One thin Pendle pool until maturity |
| Tokenized real-world assets | Aave V4, Morpho, Kamino, Blend | Market hours, issuer pauses, redemption queues |
| LSTs and LRTs | Aave, Morpho, Lido Lend | Withdrawal queues |

## What isn't built yet?

None of this is available to use today. Every component on this page is in development or in design, and the core contracts are in audit, with the report to be published when it closes. A small pilot cohort of buyers, lenders and apps comes first, before anything opens to the public.

Every contract and the keeper daemon are public under the MIT license on [GitHub](https://github.com/Nectar-Network/nectar), and the [docs](https://docs.nectar.monster) cover the design in more detail.
