"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { DataTable, cell } from "@/components/ui/DataTable";
import { ToggleButton } from "@/components/ui/ToggleButton";
import { cx } from "@/lib/cx";
import {
  COLLATERAL_CLASSES,
  FEED_MARKETS,
  type CollateralClass,
  type FeedMarket,
} from "@/data/markets";

import styles from "./Feed.module.css";

type Filter = CollateralClass | "all";

const countFor = (filter: Filter) =>
  filter === "all" ? FEED_MARKETS.length : FEED_MARKETS.filter((m) => m.cls === filter).length;

/** Collateral-class filter chips and the markets table they control. */
export function FeedMarkets() {
  const [filter, setFilter] = useState<Filter>("all");
  const rows = filter === "all" ? FEED_MARKETS : FEED_MARKETS.filter((m) => m.cls === filter);

  return (
    <>
      <div role="group" aria-label="Filter by collateral class" className={styles.chips}>
        {COLLATERAL_CLASSES.map((option) => (
          <ToggleButton
            key={option.id}
            shape="chip"
            pressed={option.id === filter}
            count={countFor(option.id)}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </ToggleButton>
        ))}
      </div>

      <DataTable minWidth={1180} headerBg aria-label="Exit capacity by market">
        <thead>
          <tr>
            <th scope="col">MARKET</th>
            <th scope="col">CLASS</th>
            <th scope="col" className={cell.num}>
              COLLATERAL
            </th>
            <th scope="col" className={cell.num}>
              BORROWED
            </th>
            <th scope="col" className={cell.num}>
              LLTV
            </th>
            <th scope="col">DEX DEPTH</th>
            <th scope="col">EXIT GAP</th>
            <th scope="col" className={cell.num}>
              COMMITTED
            </th>
            <th scope="col">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <MarketRow key={row.market} row={row} />
          ))}
        </tbody>
      </DataTable>
    </>
  );
}

function MarketRow({ row }: { row: FeedMarket }) {
  return (
    <tr>
      <td>
        <div className={styles.market}>
          <span className={styles.marketName}>{row.market}</span>
          <span className={styles.venue}>{row.venue}</span>
          <span className={styles.asOf}>as of {row.asOf}</span>
        </div>
      </td>
      <td data-label="CLASS" className={cell.nowrap}>
        {row.classLabel}
      </td>
      <td data-label="COLLATERAL" className={cx(cell.num, cell.strong, cell.nowrap)}>
        {row.collateral}
      </td>
      <td data-label="BORROWED" className={cx(cell.num, cell.nowrap)}>
        {row.borrowed}
      </td>
      <td data-label="LLTV" className={cx(cell.num, cell.nowrap)}>
        {row.lltv}
      </td>
      <td data-label="DEX DEPTH" className={styles.depth}>
        {row.depth}
      </td>
      <td data-label="EXIT GAP">
        {row.exitGap ? (
          <div className={styles.gap}>
            <span className={styles.gapAmount}>{row.exitGap.amount}</span>
            <div
              role="img"
              aria-label={`DEX depth covers ${row.exitGap.depthShare} of collateral`}
              className={styles.gapBar}
            >
              <div className={styles.gapDepth} style={{ width: row.exitGap.depthShare }} />
            </div>
          </div>
        ) : (
          <span className={cell.dim}>not measured</span>
        )}
      </td>
      <td data-label="COMMITTED" className={cx(cell.num, cell.dim)}>
        $0
      </td>
      <td data-label="STATUS">
        <StatusBadge status={row.status}>{row.statusLabel}</StatusBadge>
      </td>
    </tr>
  );
}

function StatusBadge({ status, children }: { status: FeedMarket["status"]; children: string }) {
  const tone = status === "live" ? "live" : status === "watching" ? "dashed" : "outline";
  return (
    <Badge tone={tone} size="md">
      {children}
    </Badge>
  );
}
