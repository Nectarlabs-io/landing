"use client";

import { useState, type ReactNode } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CellGrid } from "@/components/ui/CellGrid";
import { DataTable, cell } from "@/components/ui/DataTable";
import form from "@/components/ui/form.module.css";
import { Legend } from "@/components/ui/Legend";
import { Kicker } from "@/components/ui/Typography";
import { CURATOR_MARKETS, type CuratorMarket } from "@/data/markets";
import { cx } from "@/lib/cx";
import { formatMillions, formatShare, formatWhole } from "@/lib/format";
import { routes } from "@/lib/site";

import styles from "./Curator.module.css";

/** Illustrative annual capacity fee, as a share of requested capacity. */
const FEE_RATE = 0.003;

export function CuratorConsole() {
  const [marketId, setMarketId] = useState(CURATOR_MARKETS[0].id);
  const [requestInput, setRequestInput] = useState("25");

  const market = CURATOR_MARKETS.find((m) => m.id === marketId) ?? CURATOR_MARKETS[0];

  return (
    <div className={styles.layout}>
      <section aria-labelledby="mk-h" className={styles.markets}>
        <Kicker as="h2" id="mk-h" className={styles.marketsTitle}>
          MARKETS
        </Kicker>
        {CURATOR_MARKETS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={styles.market}
            aria-pressed={option.id === market.id}
            onClick={() => setMarketId(option.id)}
          >
            <span className={styles.marketName}>{option.name}</span>
            <span className={styles.marketMeta}>
              {option.venue} · {formatMillions(option.borrowed)} borrowed
            </span>
          </button>
        ))}
        <p className={styles.marketsNote}>
          Listing a market Nectar doesn&apos;t observe yet? We add it to the Feed before quoting.
        </p>
      </section>

      <Card
        as="section"
        aria-labelledby="size-h"
        strong
        gap={24}
        compactOnMobile
        className={styles.panel}
      >
        <div className={styles.panelHead}>
          <h2 id="size-h" className={styles.panelTitle}>
            {market.name}
          </h2>
          <span className={styles.meta}>
            {market.venue} · as of {market.asOf}
          </span>
        </div>

        <CellGrid as="dl" min={130} className={styles.figures}>
          <Figure term="COLLATERAL">{formatMillions(market.collateral)}</Figure>
          <Figure term="BORROWED">{formatMillions(market.borrowed)}</Figure>
          <Figure term="LLTV">{market.lltv}</Figure>
          <Figure term="DEX DEPTH" tone="accent">
            {market.depth == null ? "not measured" : formatMillions(market.depth)}
          </Figure>
          <Figure term="COMMITTED" tone="warn">
            $0
          </Figure>
        </CellGrid>

        {market.collateral != null && market.depth != null ? (
          <Sizing
            market={market}
            collateral={market.collateral}
            depth={market.depth}
            requestInput={requestInput}
            onRequestChange={setRequestInput}
          />
        ) : (
          <div className={styles.unmeasured}>
            <span className={styles.unmeasuredTitle}>DEX depth not measured yet</span>
            <p className={styles.note}>{market.note}</p>
            <ButtonLink href={routes.contact} variant="secondary" size="md">
              Request a depth study
            </ButtonLink>
          </div>
        )}
      </Card>
    </div>
  );
}

function Figure({
  term,
  tone,
  children,
}: {
  term: string;
  tone?: "accent" | "warn";
  children: ReactNode;
}) {
  return (
    <div className={styles.figure}>
      <dt>{term}</dt>
      <dd className={tone && styles[tone]}>{children}</dd>
    </div>
  );
}

function Sizing({
  market,
  collateral,
  depth,
  requestInput,
  onRequestChange,
}: {
  market: CuratorMarket;
  collateral: number;
  depth: number;
  requestInput: string;
  onRequestChange: (value: string) => void;
}) {
  const request = Math.max(0, parseFloat(requestInput) || 0);
  const capacity = depth + request;
  const depthShare = depth / collateral;
  const requestShare = Math.min(request, collateral - depth) / collateral;
  const fee = request * 1e6 * FEE_RATE;

  return (
    <div className={styles.sizing}>
      <div className={styles.requestRow}>
        <div className={cx(form.field, styles.requestField)}>
          <label htmlFor="c-req" className={form.label}>
            Capacity to request ($M of committed bids)
          </label>
          <input
            id="c-req"
            className={form.control}
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            value={requestInput}
            onChange={(event) => onRequestChange(event.target.value)}
          />
        </div>
        <div className={styles.result}>
          <span className={form.hint}>Exit capacity after request</span>
          <span className={styles.resultValue} aria-live="polite">
            {formatMillions(capacity)}
          </span>
          <span className={form.hint}>
            {formatShare(depthShare)} of collateral today →{" "}
            {formatShare(Math.min(1, capacity / collateral))}
          </span>
        </div>
      </div>

      <div className={styles.barBlock}>
        <div
          role="img"
          aria-label={`DEX depth ${formatShare(depthShare)}, requested bids ${formatShare(requestShare)} of collateral`}
          className={styles.bar}
        >
          <div className={styles.barDepth} style={{ width: formatShare(depthShare) }} />
          <div className={styles.barRequest} style={{ width: formatShare(requestShare) }} />
        </div>
        <Legend
          gap={18}
          items={[
            { color: "var(--accent)", label: "DEX depth" },
            { color: "var(--accent-deep)", label: "Your requested bids" },
            { color: "var(--warn-bar)", label: "Still uncovered" },
          ]}
        />
      </div>

      {market.tail ? (
        <div className={styles.tail}>
          <Kicker id="tail-h">COLLATERAL THAT BECOMES LIQUIDATABLE IF cirBTC FALLS</Kicker>
          <DataTable minWidth={420} density="compact" cardsOnBg aria-labelledby="tail-h">
            <thead>
              <tr>
                <th scope="col">PRICE FALL</th>
                <th scope="col" className={cell.num}>
                  LIQUIDATABLE
                </th>
                <th scope="col">WITH YOUR REQUEST</th>
              </tr>
            </thead>
            <tbody>
              {market.tail.map((row) => (
                <tr key={row.fall}>
                  <td className={cell.strong}>{row.fall}</td>
                  <td data-label="LIQUIDATABLE" className={cx(cell.num, cell.strong)}>
                    {row.amount < 1
                      ? `≈ $${Math.round(row.amount * 1000)}K`
                      : `≈ ${formatMillions(row.amount)}`}
                  </td>
                  <td data-label="WITH YOUR REQUEST">
                    {row.amount <= capacity ? (
                      <span className={cell.accent}>Covered</span>
                    ) : (
                      <span className={cell.warn}>{formatMillions(row.amount - capacity)} short</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
          <span className={form.hint}>
            BTC traded near $58K in June 2026 against cirBTC at about $80.4K on Oct 25, so a 20%
            fall is not a tail event.
          </span>
        </div>
      ) : (
        <p className={cx(styles.note, styles.noteDim)}>{market.note}</p>
      )}

      <div className={styles.feeRow}>
        <div className={styles.fee}>
          <span className={form.hint}>Capacity fee, illustrative</span>
          <span className={styles.feeValue}>${formatWhole(fee)} a year</span>
          <span className={styles.feeNote}>
            At 0.3% of requested capacity. Real fees are set per market.
          </span>
        </div>
        <ButtonLink href={routes.contact} size="lg">
          Request capacity in the pilot
        </ButtonLink>
      </div>
    </div>
  );
}
