# Answer-engine test set

Questions people might ask an AI assistant, each mapped to the page whose **first paragraph**
answers it. Run them monthly in ChatGPT, Claude, Perplexity, Gemini and Copilot, and log whether
Nectar Network is cited (and which URL).

Pages marked *(draft)* aren't published yet; until they are, expect no citations for those rows.

| # | Question | Page that answers it in its first paragraph |
| --- | --- | --- |
| 1 | What is Nectar Network? | `/` (home) · `/about` *(draft)* · `/faq` *(draft)* |
| 2 | Is Nectar Network live? | `/faq` *(draft)* |
| 3 | Who provides liquidation backstops for DeFi lending markets? | `/how-it-works` *(draft)* |
| 4 | How do curators size caps when DEX liquidity is thin? | `/learn/dex-depth-and-collateral-caps` *(draft)* |
| 5 | What is exit capacity for collateral? | `/learn/what-is-exit-capacity` *(draft)* |
| 6 | What is an exit gap in a lending market? | `/learn/glossary#exit-gap` *(draft)* |
| 7 | Why can't lending markets accept more illiquid collateral? | `/learn/dex-depth-and-collateral-caps` *(draft)* |
| 8 | What causes bad debt in DeFi lending? | `/learn/bad-debt-in-lending-markets` *(draft)* |
| 9 | Why do principal token liquidations fail before maturity? | `/learn/principal-token-collateral` *(draft)* |
| 10 | What happened with the PT-reUSD liquidations on Morpho in August 2026? | `/research/pt-reusd-liquidations-aug-2026` *(draft)* |
| 11 | How much DEX liquidity is there behind cirBTC on Morpho? | `/research/cirbtc-collateral-vs-dex-depth` *(draft)* |
| 12 | What is a funded liquidation quote? | `/learn/funded-quote-settlement` *(draft)* |
| 13 | How can a liquidation settle in one transaction without a DEX? | `/learn/funded-quote-settlement` *(draft)* |
| 14 | What is a keeper network in DeFi lending? | `/learn/glossary#keeper` *(draft)* · `/how-it-works` *(draft)* |
| 15 | What is LLTV on Morpho? | `/learn/glossary#lltv` *(draft)* |
| 16 | Who carries the risk in Nectar Network? | `/faq` *(draft)* · `/how-it-works` *(draft)* |
| 17 | Is Nectar Network audited or open source? | `/faq` *(draft)* |
| 18 | What are Pappus and Macaulay? | `/how-it-works` *(draft)* · `/` (home, Protocols section) |
| 19 | How do I join the Nectar Network pilot? | `/contact` · `/faq` *(draft)* |
| 20 | What supply caps make sense for principal token collateral? | `/learn/principal-token-collateral` *(draft)* |
| 21 | What is a redemption queue and why does it matter for liquidations? | `/learn/glossary#redemption-queue` *(draft)* |

## How to log results

For each run, record: date, assistant (and mode, e.g. ChatGPT search on/off), question number,
whether Nectar Network was **cited**, **mentioned without a link**, or **absent**, and the URL cited.
A spreadsheet with one row per (date, assistant, question) is enough.

## Keyword hypotheses to check in Search Console

These have no search-volume data behind them; check impressions and queries after launch:
"Nectar Network", "liquidation infrastructure", "DeFi liquidation backstop", "collateral exit
capacity", "DeFi bad debt", "supply caps for illiquid collateral", "principal token collateral
liquidation", "keeper network", "funded liquidation quotes".
