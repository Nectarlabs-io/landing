"use client";

import { useState } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import form from "@/components/ui/form.module.css";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { Kicker } from "@/components/ui/Typography";
import { cx } from "@/lib/cx";
import { formatWhole } from "@/lib/format";
import { routes } from "@/lib/site";

import styles from "./Quote.module.css";

/* Snapshot market: PT-reUSD-10DEC2026 on Morpho. */
const DAYS_TO_MATURITY = 44;
/** The market oracle's discount curve to maturity, as an annual rate. */
const ORACLE_ANNUAL_DISCOUNT = 0.06;

const NOTICE_OPTIONS = [
  { id: "24h", label: "24 hours" },
  { id: "72h", label: "72 hours" },
  { id: "7d", label: "7 days" },
] as const;

type NoticeId = (typeof NOTICE_OPTIONS)[number]["id"];

/** Price of a PT that redeems for 1 at maturity, at a given annual yield. */
function ptPrice(annualYield: number, years: number): number {
  return 1 / Math.pow(1 + annualYield, years);
}

function priceQuote(yieldInput: string, sizeInput: string) {
  const years = DAYS_TO_MATURITY / 365;
  const yieldPct = parseFloat(yieldInput);
  const valid = Number.isFinite(yieldPct) && yieldPct >= 0 && yieldPct < 100;
  const price = valid ? ptPrice(yieldPct / 100, years) : NaN;
  const oracle = ptPrice(ORACLE_ANNUAL_DISCOUNT, years);
  const size = parseFloat(sizeInput.replace(/,/g, "")) || 0;
  const distance = valid ? ((oracle - price) / oracle) * 100 : NaN;

  return {
    price: valid ? price.toFixed(4) : "—",
    discount: valid ? `${((1 - price) * 100).toFixed(2)}%` : "—",
    oracle: oracle.toFixed(4),
    distance: valid
      ? distance >= 0
        ? `${distance.toFixed(2)}% below`
        : `${(-distance).toFixed(2)}% above`
      : "—",
    ptAtFullFill: valid && size > 0 ? `${formatWhole(size / price)} PT` : "—",
    escrow: `${formatWhole(size)} USDC`,
  };
}

export function QuoteBuilder() {
  const [yieldInput, setYieldInput] = useState("12");
  const [sizeInput, setSizeInput] = useState("250000");
  const [notice, setNotice] = useState<NoticeId>("72h");
  const [partialFills, setPartialFills] = useState(true);

  const quote = priceQuote(yieldInput, sizeInput);
  const noticeLabel = NOTICE_OPTIONS.find((option) => option.id === notice)?.label ?? "—";

  return (
    <div className={styles.layout}>
      <form
        className={styles.form}
        aria-label="Quote details"
        onSubmit={(event) => event.preventDefault()}
      >
        <fieldset className={cx(styles.fieldset, styles.fieldsetTight)}>
          <legend className={styles.legend}>MARKET</legend>
          <label htmlFor="q-market" className={form.label}>
            Collateral you will buy
          </label>
          <select id="q-market" className={form.control} defaultValue="pt-reusd">
            <option value="pt-reusd">PT-reUSD-10DEC2026 · Morpho</option>
            <option value="pt-ausd">PT-AUSD-17DEC2026 · Aave V3</option>
            <option value="cirbtc">cirBTC · Morpho</option>
          </select>
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt>Redeems for</dt>
              <dd>1 reUSD</dd>
            </div>
            <div className={styles.fact}>
              <dt>Maturity</dt>
              <dd>Dec 10, 2026</dd>
            </div>
            <div className={styles.fact}>
              <dt>Days left</dt>
              <dd>{DAYS_TO_MATURITY}</dd>
            </div>
            <div className={styles.fact}>
              <dt>Pendle pool</dt>
              <dd>$8.97M (Aug 25)</dd>
            </div>
          </dl>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>PRICE AND SIZE</legend>
          <div className={styles.row}>
            <div className={cx(form.field, styles.grow)}>
              <label htmlFor="q-yield" className={form.label}>
                Your yield to maturity (% a year)
              </label>
              <input
                id="q-yield"
                className={form.control}
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step={0.1}
                value={yieldInput}
                onChange={(event) => setYieldInput(event.target.value)}
              />
            </div>
            <div className={cx(form.field, styles.grow)}>
              <label htmlFor="q-size" className={form.label}>
                Maximum size (USDC)
              </label>
              <input
                id="q-size"
                className={form.control}
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                value={sizeInput}
                onChange={(event) => setSizeInput(event.target.value)}
              />
            </div>
          </div>
          <p className={form.hint}>
            The market&apos;s oracle reads the lower of the 15-minute Pendle price and a 6% discount
            curve to maturity. Bids near that curve count toward the Feed.
          </p>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>TERMS</legend>
          <div className={styles.group}>
            <span id="q-notice-label" className={form.label}>
              Cancellation notice
            </span>
            <div role="group" aria-labelledby="q-notice-label" className={styles.options}>
              {NOTICE_OPTIONS.map((option) => (
                <ToggleButton
                  key={option.id}
                  pressed={option.id === notice}
                  onClick={() => setNotice(option.id)}
                >
                  {option.label}
                </ToggleButton>
              ))}
            </div>
            <span className={form.hint}>
              Longer notice makes your bid count as committed capacity. You can still cancel; the
              funds unlock when notice ends.
            </span>
          </div>
          <div className={cx(styles.row, styles.rowEnd)}>
            <div className={cx(form.field, styles.grow)}>
              <label htmlFor="q-expiry" className={form.label}>
                Quote expires
              </label>
              <input id="q-expiry" className={form.control} type="date" defaultValue="2026-12-03" />
            </div>
            <label htmlFor="q-partial" className={styles.check}>
              <input
                id="q-partial"
                className={form.checkbox}
                type="checkbox"
                checked={partialFills}
                onChange={() => setPartialFills((value) => !value)}
              />
              Allow partial fills
            </label>
          </div>
        </fieldset>
      </form>

      <aside aria-labelledby="q-summary" className={styles.aside}>
        <Card strong gap={18}>
          <Kicker as="h2" id="q-summary">
            YOUR QUOTE
          </Kicker>
          <div className={styles.price}>
            <span className={styles.priceValue} aria-live="polite">
              {quote.price}
            </span>
            <span className={form.hint}>USDC per PT · {quote.discount} below par</span>
          </div>
          <dl className={styles.summary}>
            <dt>Oracle curve today</dt>
            <dd>{quote.oracle}</dd>
            <dt>Distance to curve</dt>
            <dd>{quote.distance}</dd>
            <dt>PT at full fill</dt>
            <dd>{quote.ptAtFullFill}</dd>
            <dt>USDC to escrow</dt>
            <dd className={styles.escrow}>{quote.escrow}</dd>
            <dt>Notice</dt>
            <dd>{noticeLabel}</dd>
            <dt>Partial fills</dt>
            <dd>{partialFills ? "Allowed" : "Off"}</dd>
          </dl>
          <ButtonLink href={routes.contact} block>
            Join the pilot to post quotes
          </ButtonLink>
          <span className={styles.ctaNote}>
            Posting opens to pilot buyers first. Nothing here moves funds.
          </span>
        </Card>
        <Card tone="warn" padding="20px 24px" gap={8}>
          <Kicker tone="warn">WHAT YOU CARRY</Kicker>
          <span className={styles.carry}>
            The underlying&apos;s credit risk until Dec 10, 2026. A PT pays par only if reUSD holds.
            Macaulay lists only underlyings a curator already accepts, with exposure capped per
            issuer.
          </span>
        </Card>
      </aside>
    </div>
  );
}
